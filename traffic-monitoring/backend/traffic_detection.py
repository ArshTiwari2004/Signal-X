import cv2
import numpy as np
import time
import torch
from ultralytics import YOLO
import multiprocessing as mp
from queue import Empty
import os

class TrafficDetector:
    def __init__(self, model_path="yolov8n.pt", confidence=0.25):
        """
        Initialize the traffic detector with YOLO model
        
        Args:
            model_path: Path to the YOLO model weights
            confidence: Confidence threshold for detections
        """
        self.model = YOLO(model_path)
        self.confidence = confidence
        self.vehicle_classes = [2, 3, 5, 7]  # car, motorcycle, bus, truck
        self.ambulance_class = 7  # Assuming truck class is used for ambulance detection
        
    def detect_vehicles(self, frame):
        """
        Detect vehicles in a frame
        
        Args:
            frame: Image frame to detect vehicles in
            
        Returns:
            vehicles_count: Number of vehicles detected
            has_ambulance: Boolean indicating if an ambulance is detected
            processed_frame: Frame with detection annotations
        """
        results = self.model(frame, conf=self.confidence)[0]
        
        # Initialize counts
        vehicles_count = 0
        has_ambulance = False
        
        # Process detections
        processed_frame = frame.copy()
        
        for detection in results.boxes.data.tolist():
            x1, y1, x2, y2, confidence, class_id = detection
            
            # Convert to integers
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            class_id = int(class_id)
            
            # Check if detected object is a vehicle
            if class_id in self.vehicle_classes:
                vehicles_count += 1
                
                # Check if it might be an ambulance (using custom logic)
                vehicle_width = x2 - x1
                vehicle_height = y2 - y1
                vehicle_area = vehicle_width * vehicle_height
                
                # Draw bounding box
                color = (0, 255, 0)  # Green for regular vehicles
                
                if class_id == self.ambulance_class and vehicle_area > 15000:
                    has_ambulance = True
                    color = (0, 0, 255)  # Red for ambulance
                
                cv2.rectangle(processed_frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(processed_frame, f"Vehicle {vehicles_count}", (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                
        # Add count to the frame
        cv2.putText(processed_frame, f"Vehicles: {vehicles_count}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        if has_ambulance:
            cv2.putText(processed_frame, "AMBULANCE DETECTED! - Green light required ", (10, 70),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
        return vehicles_count, has_ambulance, processed_frame

    def process_lane(self, frame, lane_id, results_queue):
        """
        Process a single lane
        
        Args:
            frame: Image frame for the lane
            lane_id: ID of the lane (1-4)
            results_queue: Queue to put results in
        """
        vehicles_count, has_ambulance, processed_frame = self.detect_vehicles(frame)
        
        # Add results to the queue
        results_queue.put({
            'lane_id': lane_id,
            'vehicles_count': vehicles_count,
            'has_ambulance': has_ambulance,
            'processed_frame': processed_frame,
            'timestamp': time.time()
        })
        
    def process_all_lanes(self, frames):
        """
        Process all lanes in parallel
        
        Args:
            frames: Dictionary of frames, with lane IDs as keys
            
        Returns:
            results: Dictionary of results, with lane IDs as keys
        """
        # Create a multiprocessing manager and queue
        manager = mp.Manager()
        results_queue = manager.Queue()
        
        # Create processes for each lane
        processes = []
        for lane_id, frame in frames.items():
            p = mp.Process(target=self.process_lane, args=(frame, lane_id, results_queue))
            processes.append(p)
            p.start()
            
        # Wait for all processes to finish
        for p in processes:
            p.join()
            
        # Collect results
        results = {}
        while True:
            try:
                result = results_queue.get_nowait()
                results[result['lane_id']] = result
            except Empty:
                break
                
        return results

def get_test_frames():
    """
    Get test frames for each lane from test images
    Now with better debugging and more flexible file search
    """
    frames = {}
    
    # Get the absolute path to the data directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "data")  # Changed from "..", "data" to just "data"
    
    print("\n=== DEBUGGING INFORMATION ===")
    print(f"Current directory: {current_dir}")
    print(f"Looking for images in: {data_dir}")
    
    # Check if data directory exists
    if not os.path.exists(data_dir):
        print(f"ERROR: Data directory not found at {data_dir}")
        print("Creating data directory...")
        os.makedirs(data_dir, exist_ok=True)
    
    # List all files in data directory for debugging
    print("\nFiles found in data directory:")
    try:
        for f in os.listdir(data_dir):
            print(f" - {f}")
    except FileNotFoundError:
        print(" (none - directory doesn't exist)")
    
    # Try multiple possible file patterns
    file_patterns = [
        "test_image_{}.png",    # test_image_1.png
        "test_{}.png",          # test_1.png
        "lane_{}.png",          # lane_1.png
        "image_{}.jpg",         # image_1.jpg
        "test{}.jpg"            # test1.jpg
    ]
    
    found_images = 0
    
    for lane_id in range(1, 5):
        frame = None
        
        # Try multiple possible filename patterns
        for pattern in file_patterns:
            test_image_path = os.path.join(data_dir, pattern.format(lane_id))
            if os.path.exists(test_image_path):
                frame = cv2.imread(test_image_path)
                if frame is not None:
                    print(f"\nSUCCESS: Found image for lane {lane_id} at:")
                    print(f" - {test_image_path}")
                    frames[lane_id] = frame
                    found_images += 1
                    break
        
        # If no image found, create dummy frame
        if frame is None:
            print(f"\nWARNING: No image found for lane {lane_id}")
            dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(dummy_frame, f"Lane {lane_id} (dummy)", (50, 50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            frames[lane_id] = dummy_frame
    
    print(f"\n=== SUMMARY ===")
    print(f"Found images for {found_images}/4 lanes")
    if found_images < 4:
        print("NOTE: Please ensure your images are:")
        print("- In the 'data' folder next to your script")
        print("- Named like: test_image_1.png, test_image_2.png, etc.")
        print("- Supported formats: .png or .jpg")
    
    return frames


if __name__ == "__main__":
    # Demo usage
    detector = TrafficDetector()
    frames = get_test_frames()
    results = detector.process_all_lanes(frames)
    
    for lane_id, result in results.items():
        print(f"Lane {lane_id}: {result['vehicles_count']} vehicles, Ambulance: {result['has_ambulance']}")
        cv2.imshow(f"Lane {lane_id}", result['processed_frame'])
    
    cv2.waitKey(0)
    cv2.destroyAllWindows()