import cv2
import numpy as np
import time
import os
from ultralytics import YOLO

class VideoTrafficDetector:
    def __init__(self, model_path="yolov8n.pt", confidence=0.3):
        """
        Initialize the video traffic detector with YOLO model
        
        Args:
            model_path: Path to the YOLO model weights
            confidence: Confidence threshold for detections (0-1)
        """
        self.model = YOLO(model_path)
        self.confidence = confidence
        
        # Enhanced vehicle classes for Indian roads
        self.vehicle_classes = {
            # Original classes
            2: "car",
            3: "motorcycle",
            5: "bus",
            7: "truck",
            # Additional Indian road vehicles
            0: "person",          # For pedestrians on roads
            1: "bicycle",         # Common in Indian traffic
            6: "train",           # Railway crossings
            8: "auto_rickshaw",   # Three-wheelers (mapped from boat class)
        }
        
        # Color mapping for different vehicle types (BGR format)
        self.vehicle_colors = {
            "car": (0, 255, 0),           # Green
            "motorcycle": (255, 255, 0),  # Cyan
            "bus": (0, 165, 255),         # Orange
            "truck": (128, 0, 128),       # Purple
            "person": (255, 0, 0),        # Blue
            "bicycle": (255, 0, 255),     # Magenta
            "train": (0, 128, 255),       # Brown
            "auto_rickshaw": (255, 255, 0)  # Yellow
        }
        
        # Emergency vehicle detection parameters
        self.emergency_min_area = 10000      # Reduced for Indian ambulances
        self.emergency_min_ratio = 1.5       # Adjusted aspect ratio
        
        # Auto-rickshaw detection parameters (usually classified as boats by YOLO)
        self.auto_min_area = 5000
        self.auto_max_area = 15000
        self.auto_ratio = 1.2
        
        # Video processing stats
        self.frame_count = 0
        self.start_time = time.time()
        self.emergency_detected = False
        self.emergency_start_time = None
        
        # Vehicle counters
        self.vehicle_counts = {vtype: 0 for vtype in self.vehicle_classes.values()}
        self.total_count = 0

    def detect_vehicles(self, frame):
        """
        Detect vehicles in a video frame and identify emergency vehicles
        
        Args:
            frame: Video frame to process
            
        Returns:
            processed_frame: Frame with detection annotations
            vehicle_count: Total vehicles detected
            has_emergency: Boolean if emergency vehicle detected
        """
        results = self.model(frame, conf=self.confidence)[0]
        
        vehicle_count = 0
        has_emergency = False
        processed_frame = frame.copy()
        
        # Reset frame counters
        frame_counts = {vtype: 0 for vtype in self.vehicle_classes.values()}
        
        for detection in results.boxes.data.tolist():
            x1, y1, x2, y2, conf, class_id = detection
            x1, y1, x2, y2, class_id = map(int, [x1, y1, x2, y2, class_id])
            
            # Map class_id to our vehicle types
            vehicle_type = self.vehicle_classes.get(class_id)
            
            if vehicle_type:
                # Handle auto-rickshaw detection (often misclassified as boat class 8)
                if class_id == 8:
                    width, height = x2 - x1, y2 - y1
                    area = width * height
                    ratio = width / height if height > 0 else 0
                    
                    # Verify it's actually an auto based on size/ratio
                    if not (self.auto_min_area <= area <= self.auto_max_area and ratio >= self.auto_ratio):
                        continue
                
                vehicle_count += 1
                frame_counts[vehicle_type] += 1
                self.vehicle_counts[vehicle_type] += 1
                self.total_count += 1
                
                # Check for emergency vehicle characteristics
                is_emergency = self._is_emergency_vehicle(
                    (x1, y1, x2, y2), class_id, conf, frame
                )
                
                if is_emergency:
                    has_emergency = True
                    self.emergency_detected = True
                    if self.emergency_start_time is None:
                        self.emergency_start_time = time.time()
                
                # Get color for vehicle type
                color = self.vehicle_colors.get(vehicle_type, (0, 255, 0))
                if is_emergency:
                    color = (0, 0, 255)  # Red for emergency
                    
                # Draw bounding box
                cv2.rectangle(processed_frame, (x1, y1), (x2, y2), color, 2)
                
                # Prepare label with confidence
                if is_emergency:
                    label = f"EMERGENCY {vehicle_type} {conf:.2f}"
                else:
                    label = f"{vehicle_type} {conf:.2f}"
                
                # Add text background for better visibility
                text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
                cv2.rectangle(
                    processed_frame, 
                    (x1, y1 - text_size[1] - 10), 
                    (x1 + text_size[0], y1), 
                    color, 
                    -1
                )
                
                # Add text
                cv2.putText(
                    processed_frame, label, (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2
                )
        
        # Update frame count display
        self._add_count_display(processed_frame, frame_counts)
        
        return processed_frame, vehicle_count, has_emergency

    def _is_emergency_vehicle(self, bbox, class_id, confidence, frame):
        """
        Determine if a detected vehicle is likely an emergency vehicle
        
        Args:
            bbox: (x1, y1, x2, y2) bounding box coordinates
            class_id: Detected class ID
            confidence: Detection confidence
            frame: Original frame for additional analysis
            
        Returns:
            bool: True if likely emergency vehicle
        """
        x1, y1, x2, y2 = bbox
        width = x2 - x1
        height = y2 - y1
        area = width * height
        
        # Check if it's an ambulance/emergency vehicle (can be car, van or truck in Indian context)
        if class_id not in [2, 7]:  # Car or truck
            return False
            
        # Size check (ambulances in India can be smaller)
        if area < self.emergency_min_area:
            return False
            
        # Aspect ratio check
        aspect_ratio = width / height
        if aspect_ratio < self.emergency_min_ratio:
            return False
        
        # Check for ambulance colors - typically white with red markings
        # Extract the vehicle region
        vehicle_region = frame[y1:y2, x1:x2]
        if vehicle_region.size == 0:
            return False
            
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(vehicle_region, cv2.COLOR_BGR2HSV)
        
        # Define white and red color ranges (in HSV)
        white_lower = np.array([0, 0, 200])
        white_upper = np.array([180, 30, 255])
        red_lower1 = np.array([0, 100, 100])
        red_upper1 = np.array([10, 255, 255])
        red_lower2 = np.array([160, 100, 100])
        red_upper2 = np.array([180, 255, 255])
        
        # Create masks
        white_mask = cv2.inRange(hsv, white_lower, white_upper)
        red_mask1 = cv2.inRange(hsv, red_lower1, red_upper1)
        red_mask2 = cv2.inRange(hsv, red_lower2, red_upper2)
        red_mask = cv2.bitwise_or(red_mask1, red_mask2)
        
        # Calculate percentage of white and red
        white_percent = np.sum(white_mask > 0) / white_mask.size
        red_percent = np.sum(red_mask > 0) / red_mask.size
        
        # If significant white and some red markings, likely an ambulance
        if white_percent > 0.4 and red_percent > 0.05:
            return True
            
        # Confidence threshold for emergency vehicles
        return confidence > 0.65

    def _add_count_display(self, frame, frame_counts):
        """Add vehicle count information to the frame"""
        # Add a semi-transparent overlay
        h, w = frame.shape[:2]
        overlay = frame.copy()
        cv2.rectangle(overlay, (w-250, 0), (w, 180), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
        
        # Add title
        cv2.putText(
            frame, "VEHICLE COUNT", (w-240, 20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2
        )
        
        # Add counts for each type
        y_pos = 50
        for vtype, count in frame_counts.items():
            if count > 0:  # Only show detected types
                color = self.vehicle_colors.get(vtype, (255, 255, 255))
                cv2.putText(
                    frame, f"{vtype}: {count}", (w-240, y_pos),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
                )
                y_pos += 25
        
        # Add total
        cv2.putText(
            frame, f"Total: {sum(frame_counts.values())}", (w-240, y_pos),
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2
        )

    def process_video(self, video_path, output_path=None):
        """
        Process a video file for vehicle and emergency vehicle detection
        
        Args:
            video_path: Path to input video file
            output_path: Optional path to save processed video
        """
        # Convert to absolute path and verify file exists
        video_path = os.path.abspath(video_path)
        if not os.path.exists(video_path):
            print(f"Error: Video file not found at {video_path}")
            return
            
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"Error opening video file {video_path}")
            return
            
        # Get video properties
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Initialize video writer if output path is specified
        if output_path:
            output_path = os.path.abspath(output_path)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(
                output_path, fourcc, fps, 
                (frame_width, frame_height)
            )
        
        print(f"\n✅ Processing Indian Traffic Video: {video_path}")
        print(f"📐 Frame size: {frame_width}x{frame_height}, FPS: {fps:.1f}")
        print("🔍 Looking for Indian vehicles including cars, motorcycles, auto-rickshaws, buses, and more...")
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            self.frame_count += 1
            
            # Process frame
            processed_frame, vehicle_count, has_emergency = self.detect_vehicles(frame)
            
            # Add frame counter and stats
            self._add_frame_info(processed_frame)
            
            # Add emergency alert if detected
            if has_emergency:
                self._add_emergency_alert(processed_frame)
            
            # Display processed frame
            cv2.imshow('Indian Traffic Detection', processed_frame)
            
            # Write frame to output if specified
            if output_path:
                out.write(processed_frame)
            
            # Exit on 'q' key
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        # Release resources
        cap.release()
        if output_path:
            out.release()
        cv2.destroyAllWindows()
        
        # Print summary stats
        self._print_summary_stats()

    def _add_frame_info(self, frame):
        """Add frame counter and processing info to the frame"""
        elapsed_time = time.time() - self.start_time
        fps = self.frame_count / elapsed_time if elapsed_time > 0 else 0
        
        # Add a semi-transparent overlay
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (300, 70), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
        
        info_text = f"Frame: {self.frame_count} | FPS: {fps:.1f}"
        cv2.putText(
            frame, info_text, (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2
        )
        
        # Adding detection status
        cv2.putText(
            frame, f"Detecting Indian traffic...", (10, 60),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2
        )

    def _add_emergency_alert(self, frame):
        """Add visual emergency alert to the frame"""
        h, w = frame.shape[:2]
        
        # Create blinking effect with alternating background
        if int(time.time() * 2) % 2 == 0:
            # Add a semi-transparent overlay across the top
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (w, 80), (0, 0, 255), -1)
            cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
        
        # Add text with shadow effect for better visibility
        alert_text = "EMERGENCY VEHICLE - PRIORITY GREEN LIGHT"
        
        # Shadow (black outline)
        cv2.putText(
            frame, alert_text, (w//2 - 240 + 2, 40 + 2),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 3
        )
        
        # Main text (white)
        cv2.putText(
            frame, alert_text, (w//2 - 240, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2
        )
        
        # Show time since detection
        if self.emergency_start_time:
            elapsed = time.time() - self.emergency_start_time
            time_text = f"Emergency active for {elapsed:.1f}s"
            cv2.putText(
                frame, time_text, (w//2 - 120, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2
            )

    def _print_summary_stats(self):
        """Print processing summary statistics"""
        elapsed_time = time.time() - self.start_time
        print("\n📊 Processing Summary:")
        print(f"- Total frames processed: {self.frame_count}")
        print(f"- Total processing time: {elapsed_time:.2f} seconds")
        print(f"- Average FPS: {self.frame_count/elapsed_time:.1f}")
        
        # Print vehicle counts
        print("\n🚗 Vehicle Counts:")
        for vtype, count in self.vehicle_counts.items():
            if count > 0:
                print(f"- {vtype.capitalize()}: {count}")
        print(f"- Total vehicles: {self.total_count}")
        
        # Emergency stats
        if self.emergency_detected:
            print("\n🚑 Emergency Vehicle Detected!")
            if self.emergency_start_time:
                duration = time.time() - self.emergency_start_time
                print(f"- Emergency duration: {duration:.2f} seconds")
        else:
            print("\n🚦 No emergency vehicles detected")

def main():
    # Initializing detector with a slightly lower confidence threshold for Indian traffic
    detector = VideoTrafficDetector(confidence=0.25)
    
    # Get the absolute path to the video file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "data")
    video_path = os.path.join(data_dir, "test_video3.mp4")
    
    # Verify the video file exists
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        print("Please ensure:")
        print(f"1. The 'data' folder exists in {current_dir}")
        print(f"2. The video file 'test_video3.mp4' exists in the data folder")
        return
    
    # Process video
    detector.process_video(video_path)
    
    # To save processed video, uncomment:
    # output_path = os.path.join(data_dir, "processed_indian_traffic.mp4")
    # detector.process_video(video_path, output_path)

if __name__ == "__main__":
    main()