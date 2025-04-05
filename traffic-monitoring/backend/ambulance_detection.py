import cv2
import numpy as np
import json
import time
import pygame

# Initialize pygame for audio
pygame.mixer.init()
alert_sound = pygame.mixer.Sound('alert.wav')  # Keep this very short (0.5s)

# Strict Ambulance Detection Parameters
MIN_RED_AREA = 1500       # Increase minimum size to avoid small red objects
ASPECT_RATIO_RANGE = (1.5, 3.0)  # Ambulance-like aspect ratio (width/height)
RED_PIXEL_RATIO = 0.4     # Minimum % of red pixels in bounding box
WHITE_CROSS_AREA = 0.08   # Minimum white cross area relative to red area

# HSV Color ranges for ambulance red
RED_LOWER1 = np.array([0, 150, 100])    # Bright red
RED_UPPER1 = np.array([10, 255, 255])
RED_LOWER2 = np.array([160, 150, 100])  # Dark red
RED_UPPER2 = np.array([180, 255, 255])

# White color for cross detection
WHITE_LOWER = np.array([0, 0, 200])
WHITE_UPPER = np.array([180, 30, 255])

class StrictAmbulanceDetector:
    def __init__(self, source=0):
        self.cap = cv2.VideoCapture(source)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        self.detection_window = None
        self.last_alert_time = 0
        
    def detect_white_cross(self, roi):
        """Detect white cross pattern in the red region"""
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        white_mask = cv2.inRange(hsv, WHITE_LOWER, WHITE_UPPER)
        
        # Look for cross patterns using line detection
        edges = cv2.Canny(white_mask, 50, 150)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 25, 
                               minLineLength=20, maxLineGap=5)
        
        if lines is not None:
            # Count intersecting lines (crude cross detection)
            return len(lines) >= 2
        return False
    
    def verify_ambulance(self, frame, x, y, w, h):
        """Apply multiple verification steps"""
        # 1. Check aspect ratio (ambulances are longer than wide)
        aspect_ratio = w / float(h)
        if not (ASPECT_RATIO_RANGE[0] <= aspect_ratio <= ASPECT_RATIO_RANGE[1]):
            return False
            
        # 2. Extract the ROI and check for white cross
        roi = frame[y:y+h, x:x+w]
        has_cross = self.detect_white_cross(roi)
        
        # 3. Verify red color dominance
        hsv_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        red_mask1 = cv2.inRange(hsv_roi, RED_LOWER1, RED_UPPER1)
        red_mask2 = cv2.inRange(hsv_roi, RED_LOWER2, RED_UPPER2)
        red_pixels = cv2.countNonZero(cv2.bitwise_or(red_mask1, red_mask2))
        red_ratio = red_pixels / float(w * h)
        
        return has_cross and (red_ratio >= RED_PIXEL_RATIO)
    
    def detect(self, frame):
        """Main detection pipeline"""
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Get red regions (both hue ranges)
        red_mask1 = cv2.inRange(hsv, RED_LOWER1, RED_UPPER1)
        red_mask2 = cv2.inRange(hsv, RED_LOWER2, RED_UPPER2)
        red_mask = cv2.bitwise_or(red_mask1, red_mask2)
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_OPEN, kernel)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < MIN_RED_AREA:
                continue
                
            x, y, w, h = cv2.boundingRect(cnt)
            
            # Strict ambulance verification
            if self.verify_ambulance(frame, x, y, w, h):
                self.detection_window = (x, y, w, h)
                return True
                
        return False
    
    def generate_response(self):
        return json.dumps({
            "detection": True,
            "action": "GREEN_LIGHT",
            "timestamp": time.time(),
            "position": self.detection_window
        })
    
    def run(self):
        print("STRICT Ambulance Detection Active - Only red ambulances with crosses will trigger")
        print("Press 'q' to quit")
        
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
                
            detected = self.detect(frame)
            
            # Visual feedback
            if detected:
                x, y, w, h = self.detection_window
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
                cv2.putText(frame, "AMBULANCE CONFIRMED", (x, y-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
                # Throttle alerts to avoid spamming
                if time.time() - self.last_alert_time > 2:  # 2 second cooldown
                    alert_sound.play()
                    self.last_alert_time = time.time()
                    print(self.generate_response())
            
            # Display
            cv2.imshow('Strict Ambulance Detector', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        self.cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    # Initialize with camera source
    detector = StrictAmbulanceDetector(source=0)  # 0 for laptop cam, 1 for external
    
    # For better results:
    print("Calibration Tips:")
    print("1. Ensure good lighting (avoid shadows)")
    print("2. Paint toy ambulance with bright red and clear white cross")
    print("3. Hold ambulance 1-2 meters from camera")
    
    detector.run()