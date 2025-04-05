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
        self.vehicle_classes = {
            2: "car",
            3: "motorcycle",
            5: "bus",
            7: "truck"  # We'll use truck class for ambulance detection
        }
        
        # Emergency vehicle detection parameters
        self.emergency_min_area = 15000  # Minimum pixel area
        self.emergency_min_ratio = 2.0   # Width/height ratio
        
        # Video processing stats
        self.frame_count = 0
        self.start_time = time.time()
        self.emergency_detected = False
        self.emergency_start_time = None

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
        
        for detection in results.boxes.data.tolist():
            x1, y1, x2, y2, conf, class_id = detection
            x1, y1, x2, y2, class_id = map(int, [x1, y1, x2, y2, class_id])
            
            if class_id in self.vehicle_classes:
                vehicle_count += 1
                
                # Check for emergency vehicle characteristics
                is_emergency = self._is_emergency_vehicle(
                    (x1, y1, x2, y2), class_id, conf
                )
                
                if is_emergency:
                    has_emergency = True
                    self.emergency_detected = True
                    if self.emergency_start_time is None:
                        self.emergency_start_time = time.time()
                
                # Draw bounding box
                color = (0, 255, 0)  # Green for normal vehicles
                if is_emergency:
                    color = (0, 0, 255)  # Red for emergency
                    
                cv2.rectangle(processed_frame, (x1, y1), (x2, y2), color, 2)
                label = f"{self.vehicle_classes[class_id]} {conf:.2f}"
                cv2.putText(
                    processed_frame, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
                )
        
        return processed_frame, vehicle_count, has_emergency

    def _is_emergency_vehicle(self, bbox, class_id, confidence):
        """
        Determine if a detected vehicle is likely an emergency vehicle
        
        Args:
            bbox: (x1, y1, x2, y2) bounding box coordinates
            class_id: Detected class ID
            confidence: Detection confidence
            
        Returns:
            bool: True if likely emergency vehicle
        """
        x1, y1, x2, y2 = bbox
        width = x2 - x1
        height = y2 - y1
        area = width * height
        
        # Must be a large vehicle (truck/bus class)
        if class_id != 7 or area < self.emergency_min_area:
            return False
            
        # Check aspect ratio (ambulances are typically longer)
        aspect_ratio = width / height
        if aspect_ratio < self.emergency_min_ratio:
            return False
            
        # Additional confidence threshold for emergency vehicles
        return confidence > 0.5

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
        
        print(f"Processing video: {video_path}")
        print(f"Frame size: {frame_width}x{frame_height}, FPS: {fps:.1f}")
        
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
            cv2.imshow('Traffic Detection', processed_frame)
            
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
        
        info_text = f"Frame: {self.frame_count} | FPS: {fps:.1f}"
        cv2.putText(
            frame, info_text, (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2
        )
        
        # Adding vehicle count
        cv2.putText(
            frame, f"Detecting vehicles...", (10, 60),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2
        )

    def _add_emergency_alert(self, frame):
        """Add visual emergency alert to the frame"""
        # Blinking effect
        if int(time.time() * 2) % 2 == 0:
            cv2.rectangle(frame, (0, 0), (frame.shape[1], 70), (0, 0, 255), -1)
        
        alert_text = "EMERGENCY VEHICLE DETECTED - PRIORITY GREEN LIGHT REQUIRED"
        cv2.putText(
            frame, alert_text, (10, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2
        )
        
        # Show time since detection
        if self.emergency_start_time:
            elapsed = time.time() - self.emergency_start_time
            time_text = f"Emergency active for {elapsed:.1f}s"
            cv2.putText(
                frame, time_text, (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2
            )

    def _print_summary_stats(self):
        """Print processing summary statistics"""
        elapsed_time = time.time() - self.start_time
        print("\nProcessing Summary:")
        print(f"- Total frames processed: {self.frame_count}")
        print(f"- Total processing time: {elapsed_time:.2f} seconds")
        print(f"- Average FPS: {self.frame_count/elapsed_time:.1f}")
        print(f"- Emergency vehicle detected: {'Yes' if self.emergency_detected else 'No'}")

def main():
    # Initializing detector
    detector = VideoTrafficDetector()
    
    # Get the absolute path to the video file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "data")
    video_path = os.path.join(data_dir, "test_video.mp4")
    
    # Verify the video file exists
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
        print("Please ensure:")
        print(f"1. The 'data' folder exists in {current_dir}")
        print(f"2. The video file 'test_video.mp4' exists in the data folder")
        return
    
    # Process video
    detector.process_video(video_path)
    
    # To save processed video, uncomment:
    # output_path = os.path.join(data_dir, "processed_video.mp4")
    # detector.process_video(video_path, output_path)

if __name__ == "__main__":
    main()