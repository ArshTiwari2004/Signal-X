import os
import cv2
import numpy as np
import time
import torch
from ultralytics import YOLO
from collections import deque
import threading
import concurrent.futures
from datetime import datetime
import pygame
from pygame.locals import *
import glob
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg

# Initialize pygame for display purposes
pygame.init()
pygame.display.set_caption("AI Traffic Signal Optimization")
info_object = pygame.display.Info()
SCREEN_WIDTH, SCREEN_HEIGHT = 1280, 720
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.RESIZABLE)  # Make window resizable
clock = pygame.time.Clock()

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)
BLUE = (0, 0, 255)
GRAY = (220, 220, 220)
DARK_GRAY = (80, 80, 80)
BG_COLOR = (30, 30, 30)

# Fonts
font_small = pygame.font.SysFont('Arial', 18)
font_medium = pygame.font.SysFont('Arial', 22, bold=True)
font_large = pygame.font.SysFont('Arial', 30, bold=True)
font_title = pygame.font.SysFont('Arial', 36, bold=True)

# Scrolling parameters
SCROLL_SPEED = 20
scrollable_surface_height = 1500  # Initial height, will adjust as needed
scroll_y = 0

# Load the YOLO model
model = YOLO('yolov8n.pt')

# Define classes for Indian traffic (relevant classes from COCO dataset)
CLASSES = ['person', 'bicycle', 'car', 'motorcycle', 'bus', 'truck', 'traffic light',
           'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
           'dog', 'horse', 'sheep', 'cow', 'elephant']

# Classes to count as vehicles
VEHICLE_CLASSES = ['bicycle', 'car', 'motorcycle', 'bus', 'truck']
# Emergency vehicles would be here if we were detecting them
EMERGENCY_CLASSES = []

# Signal timing parameters
MIN_GREEN_TIME = 10  # Minimum green light time in seconds
MAX_GREEN_TIME = 60  # Maximum green light time in seconds
BASE_TIME = 15       # Base green light time in seconds
TIME_PER_VEHICLE = 0.5  # Additional time per vehicle

# Store lane data
class LaneData:
    def __init__(self, lane_id, video_path):
        self.lane_id = lane_id
        self.video_path = video_path
        self.vehicle_count = 0
        self.vehicle_types = {}
        self.green_time = BASE_TIME
        self.is_emergency = False
        self.current_frame = None
        self.detection_frame = None
        self.processing_complete = False
    
    def calculate_green_time(self):
        # Calculate green time based on vehicle count
        calculated_time = BASE_TIME + (self.vehicle_count * TIME_PER_VEHICLE)
        # Clamp between min and max time
        self.green_time = max(MIN_GREEN_TIME, min(MAX_GREEN_TIME, calculated_time))
        return self.green_time

    def reset(self):
        self.vehicle_count = 0
        self.vehicle_types = {}
        self.is_emergency = False
        self.processing_complete = False

class TrafficSystem:
    def __init__(self, data_folder="data"):
        self.data_folder = data_folder
        self.lanes = []
        self.current_lane_index = 0
        self.remaining_time = 0
        self.is_running = True
        self.start_time = time.time()
        self.is_processing = False
        self.processing_results = None
        self.traffic_summary = []
        self.total_cycles = 0
        self.detection_history = {0: [], 1: [], 2: [], 3: []}
        self.time_history = {0: [], 1: [], 2: [], 3: []}
        self.active_video_capture = None
        self.active_video_thread = None
        self.video_processing_done = False
        self.load_videos()  # Initialize lanes at instantiation time
        
    def load_videos(self):
        # Look for video files in the data folder
        video_files = sorted(glob.glob(os.path.join(self.data_folder, "video*.mp4")))
        
        if not video_files:
            # If no videos found, create sample data
            print(f"No video files found in '{self.data_folder}'. Using sample data.")
            for i in range(4):
                self.lanes.append(LaneData(i, None))
        else:
            # Load videos into lanes
            for i, video_path in enumerate(video_files[:4]):  # Limit to 4 lanes
                self.lanes.append(LaneData(i, video_path))
                print(f"Loaded Lane {i+1}: {video_path}")
                
        # If less than 4 videos found, pad with None
        while len(self.lanes) < 4:
            self.lanes.append(LaneData(len(self.lanes), None))
            
        # Set initial time for the first lane
        self.remaining_time = self.lanes[0].green_time
        
        # Process the first lane right away to get initial data
        self.process_lane(0)
    
    def process_video_thread(self, lane_index):
        """Thread function to process video with real-time display"""
        lane = self.lanes[lane_index]
        
        if lane.video_path is None or not os.path.exists(lane.video_path):
            # Simulate processing for demo if no video
            print(f"Simulating processing for Lane {lane_index+1}")
            time.sleep(2)  # Simulate processing time
            # Generate random data for demo
            lane.vehicle_count = np.random.randint(5, 20)
            vehicle_types = {'car': 0, 'motorcycle': 0, 'bus': 0, 'truck': 0, 'bicycle': 0}
            for _ in range(lane.vehicle_count):
                vtype = np.random.choice(VEHICLE_CLASSES)
                vehicle_types[vtype] = vehicle_types.get(vtype, 0) + 1
            lane.vehicle_types = vehicle_types
            lane.processing_complete = True
            self.video_processing_done = True
            return
        
        cap = cv2.VideoCapture(lane.video_path)
        self.active_video_capture = cap
        
        # Get video properties
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        sample_interval = max(1, int(fps/2))  # Sample at half FPS for better performance
        
        # Process video frames
        frame_count = 0
        max_vehicles = 0
        aggregated_counts = {}
        
        while cap.isOpened() and not self.video_processing_done:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process every nth frame to improve performance
            if frame_count % sample_interval == 0:
                # Run inference with YOLO
                results = model(frame, conf=0.25)
                
                # Count vehicles in this frame and draw bounding boxes
                frame_counts = {'car': 0, 'motorcycle': 0, 'bus': 0, 'truck': 0, 'bicycle': 0}
                annotated_frame = frame.copy()
                
                for r in results:
                    boxes = r.boxes
                    for box in boxes:
                        class_id = int(box.cls[0])
                        if class_id < len(model.names):
                            class_name = model.names[class_id]
                            if class_name in VEHICLE_CLASSES:
                                frame_counts[class_name] = frame_counts.get(class_name, 0) + 1
                                
                                # Draw bounding box
                                x1, y1, x2, y2 = box.xyxy[0]
                                cv2.rectangle(annotated_frame, 
                                            (int(x1), int(y1)), 
                                            (int(x2), int(y2)), 
                                            (0, 255, 0), 2)
                                cv2.putText(annotated_frame, class_name, 
                                           (int(x1), int(y1) - 10), 
                                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                                           (0, 255, 0), 2)
                
                # Update max vehicles count
                frame_total = sum(frame_counts.values())
                if frame_total > max_vehicles:
                    max_vehicles = frame_total
                    aggregated_counts = frame_counts.copy()
                    lane.detection_frame = annotated_frame.copy()
                
                # Update current frame for display
                lane.current_frame = annotated_frame.copy()
                lane.vehicle_count = frame_total
                lane.vehicle_types = frame_counts
            
            frame_count += 1
            
            # Small delay to allow pygame to update
            time.sleep(0.01)
        
        # Set final lane data from the frame with most vehicles
        lane.vehicle_count = sum(aggregated_counts.values())
        lane.vehicle_types = aggregated_counts
        lane.processing_complete = True
        self.video_processing_done = True
        
        if cap and cap.isOpened():
            cap.release()
    
    def process_lane(self, lane_index):
        """Process video for the specified lane to count vehicles"""
        self.is_processing = True
        self.video_processing_done = False
        lane = self.lanes[lane_index]
        
        # Start video processing in a separate thread
        self.active_video_thread = threading.Thread(
            target=self.process_video_thread, 
            args=(lane_index,)
        )
        self.active_video_thread.start()
        
        # Wait for processing to complete
        while not self.video_processing_done:
            time.sleep(0.1)
        
        # Calculate green time based on vehicle count
        lane.calculate_green_time()
        
        # Store statistics for history
        self.detection_history[lane_index].append(lane.vehicle_count)
        self.time_history[lane_index].append(lane.green_time)
        
        # Add to traffic summary
        self.traffic_summary.append({
            'timestamp': datetime.now().strftime("%H:%M:%S"),
            'lane': lane_index + 1,
            'vehicle_count': lane.vehicle_count,
            'green_time': lane.green_time,
            'vehicle_types': lane.vehicle_types
        })
        
        self.is_processing = False
        return lane
    
    def switch_to_next_lane(self):
        """Switch to the next lane in sequence"""
        # Reset current lane
        self.lanes[self.current_lane_index].reset()
        
        # Move to next lane
        self.current_lane_index = (self.current_lane_index + 1) % len(self.lanes)
        
        # Stop any active video processing
        self.video_processing_done = True
        if self.active_video_thread and self.active_video_thread.is_alive():
            self.active_video_thread.join()
        
        if self.active_video_capture and self.active_video_capture.isOpened():
            self.active_video_capture.release()
        
        # Process next lane
        self.process_lane(self.current_lane_index)
            
        # Set time for this lane
        self.remaining_time = self.lanes[self.current_lane_index].green_time
        
        # Increment cycle counter if we've gone through all lanes
        if self.current_lane_index == 0:
            self.total_cycles += 1

    def update(self, dt):
        """Update the traffic system state"""
        if self.remaining_time <= 0:
            self.switch_to_next_lane()
        else:
            self.remaining_time -= dt
    
    def render_traffic_light(self, surface, x, y, lane_index, size=80):
        """Render a traffic light for the given lane"""
        # Adjust y position with scroll
        y = y - scroll_y
        
        # Skip if not visible
        if y + size*2.5 < 0 or y > SCREEN_HEIGHT:
            return
        
        # Draw traffic light housing
        pygame.draw.rect(surface, DARK_GRAY, (x, y, size, size*2.5), border_radius=15)
        pygame.draw.rect(surface, BLACK, (x, y, size, size*2.5), 2, border_radius=15)
        
        # Light spacing
        light_size = size * 0.7
        margin = (size - light_size) / 2
        light_y_spacing = size * 0.8
        
        # Draw red light
        red_color = RED if lane_index != self.current_lane_index else (100, 0, 0)
        pygame.draw.circle(surface, red_color, (x + size/2, y + margin + light_size/2), light_size/2)
        
        # Draw yellow light
        yellow_color = (100, 100, 0)
        if self.current_lane_index == lane_index and self.remaining_time <= 5:
            yellow_color = YELLOW  # Light up yellow when 5 seconds left
        pygame.draw.circle(surface, yellow_color, (x + size/2, y + margin + light_y_spacing + light_size/2), light_size/2)
        
        # Draw green light
        green_color = (0, 100, 0)
        if lane_index == self.current_lane_index and self.remaining_time > 5:
            green_color = GREEN  # Light up green if current lane and not in last 5 seconds
        pygame.draw.circle(surface, green_color, (x + size/2, y + margin + light_y_spacing*2 + light_size/2), light_size/2)
        
        # Lane label
        lane_text = font_medium.render(f"Lane {lane_index + 1}", True, WHITE)
        surface.blit(lane_text, (x + size/2 - lane_text.get_width()/2, y + size*2.5 + 10))
        
        # Vehicle count
        count_text = font_small.render(f"Vehicles: {self.lanes[lane_index].vehicle_count}", True, WHITE)
        surface.blit(count_text, (x + size/2 - count_text.get_width()/2, y + size*2.5 + 40))
        
        # Timer text
        if lane_index == self.current_lane_index:
            time_color = GREEN if self.remaining_time > 5 else YELLOW
            time_text = font_medium.render(f"{int(self.remaining_time)}s", True, time_color)
            surface.blit(time_text, (x + size/2 - time_text.get_width()/2, y + size*2.5 + 70))
    
    def render_lane_video(self, surface, x, y, lane_index, width=400, height=300):
        """Render the video feed or a placeholder for the given lane"""
        # Adjust y position with scroll
        y = y - scroll_y
        
        # Skip if not visible on screen
        if y + height < 0 or y > SCREEN_HEIGHT:
            return
        
        # Draw video area
        pygame.draw.rect(surface, DARK_GRAY, (x, y, width, height))
        pygame.draw.rect(surface, BLACK, (x, y, width, height), 2)
        
        # Highlight current lane
        if lane_index == self.current_lane_index:
            pygame.draw.rect(surface, GREEN if self.remaining_time > 5 else YELLOW, (x, y, width, height), 4)
        
        lane = self.lanes[lane_index]
        
        if lane.current_frame is not None:
            # Convert OpenCV frame to pygame surface - FIX ROTATION ISSUE
            frame = cv2.resize(lane.current_frame, (width, height))
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # Don't rotate the image as it causes viewing problems
            pygame_surface = pygame.surfarray.make_surface(frame.swapaxes(0, 1))
            surface.blit(pygame_surface, (x, y))
            
            # Show vehicle count overlay
            count_bg = pygame.Surface((width//3, 30), pygame.SRCALPHA)
            count_bg.fill((0, 0, 0, 180))  # Semi-transparent black
            surface.blit(count_bg, (x + 10, y + 10))
            
            count_text = font_small.render(f"Detected: {lane.vehicle_count}", True, GREEN)
            surface.blit(count_text, (x + 15, y + 15))
        else:
            # Show placeholder if no video
            if lane_index == self.current_lane_index:
                status_text = font_medium.render("PROCESSING", True, YELLOW)
                surface.blit(status_text, (x + width/2 - status_text.get_width()/2, y + height/2 - 15))
            else:
                status_text = font_medium.render("WAITING", True, RED)
                surface.blit(status_text, (x + width/2 - status_text.get_width()/2, y + height/2 - 15))
            
            # Show vehicle count breakdown if available
            if lane.processing_complete:
                y_offset = y + height/2 + 15
                for vtype, count in lane.vehicle_types.items():
                    if count > 0:
                        vtype_text = font_small.render(f"{vtype.capitalize()}: {count}", True, WHITE)
                        surface.blit(vtype_text, (x + width/2 - vtype_text.get_width()/2, y_offset))
                        y_offset += 20

    def render_traffic_stats(self, surface, x, y, width=500, height=300):
        """Render traffic statistics summary"""
        # Adjust y position with scroll
        y = y - scroll_y
        
        # Skip if not visible
        if y + height < 0 or y > SCREEN_HEIGHT:
            return
            
        # Draw stats area
        pygame.draw.rect(surface, DARK_GRAY, (x, y, width, height), border_radius=10)
        pygame.draw.rect(surface, BLACK, (x, y, width, height), 2, border_radius=10)
        
        # Title
        title_text = font_medium.render("Traffic Analysis", True, WHITE)
        surface.blit(title_text, (x + width/2 - title_text.get_width()/2, y + 10))
        
        # Total vehicles
        total_vehicles = sum(lane.vehicle_count for lane in self.lanes)
        vehicles_text = font_small.render(f"Total Vehicles: {total_vehicles}", True, WHITE)
        surface.blit(vehicles_text, (x + 20, y + 50))
        
        # Busiest lane
        busiest_idx = max(range(len(self.lanes)), key=lambda i: self.lanes[i].vehicle_count)
        busiest_text = font_small.render(f"Busiest Lane: Lane {busiest_idx + 1} ({self.lanes[busiest_idx].vehicle_count} vehicles)", True, WHITE)
        surface.blit(busiest_text, (x + 20, y + 80))
        
        # Current cycle
        cycle_text = font_small.render(f"Cycle Count: {self.total_cycles}", True, WHITE)
        surface.blit(cycle_text, (x + 20, y + 110))
        
        # Runtime
        runtime = time.time() - self.start_time
        runtime_text = font_small.render(f"Running Time: {int(runtime//60)}m {int(runtime%60)}s", True, WHITE)
        surface.blit(runtime_text, (x + 20, y + 140))
        
        # Traffic summary for last cycle
        if self.traffic_summary:
            y_pos = y + 180
            summary_title = font_small.render("Recent Traffic Summary:", True, WHITE)
            surface.blit(summary_title, (x + 20, y_pos))
            y_pos += 25
            
            for entry in self.traffic_summary[-min(4, len(self.traffic_summary)):]:
                summary_text = font_small.render(
                    f"Lane {entry['lane']}: {entry['vehicle_count']} vehicles, {int(entry['green_time'])}s green", 
                    True, WHITE
                )
                surface.blit(summary_text, (x + 30, y_pos))
                y_pos += 20

    def render_traffic_chart(self, surface, x, y, width=500, height=240):
        """Render chart of traffic data"""
        # Adjust y position with scroll
        y = y - scroll_y
        
        # Skip if not visible
        if y + height < 0 or y > SCREEN_HEIGHT:
            return
            
        # Create figure for plotting
        fig, ax = plt.subplots(figsize=(width/100, height/100), dpi=100)
        fig.patch.set_alpha(0.0)
        ax.set_facecolor((0.2, 0.2, 0.2, 0.7))
        
        # Plot vehicle counts by lane
        lanes = []
        counts = []
        times = []
        
        for lane_idx in range(4):
            if self.detection_history[lane_idx]:
                lanes.append(f"Lane {lane_idx+1}")
                counts.append(self.detection_history[lane_idx][-1])
                times.append(self.time_history[lane_idx][-1])
        
        if not lanes:  # No data yet
            return
            
        # Plot
        x_pos = np.arange(len(lanes))
        width_bar = 0.35
        
        rects1 = ax.bar(x_pos - width_bar/2, counts, width_bar, label='Vehicle Count', color='skyblue')
        rects2 = ax.bar(x_pos + width_bar/2, times, width_bar, label='Green Time (s)', color='lightgreen')
        
        # Customize plot
        ax.set_title('Latest Traffic Data by Lane', color='white')
        ax.set_ylabel('Count / Time', color='white')
        ax.set_xticks(x_pos)
        ax.set_xticklabels(lanes, color='white')
        ax.tick_params(axis='y', colors='white')
        ax.legend(facecolor=(0.2, 0.2, 0.2, 0.7), labelcolor='white')
        ax.grid(True, linestyle='--', alpha=0.3)
        
        # Convert plot to pygame surface
        canvas = FigureCanvasAgg(fig)
        canvas.draw()
        renderer = canvas.get_renderer()
        raw_data = renderer.tostring_argb()
        size = canvas.get_width_height()
        
        # Convert to pygame surface
        surf = pygame.image.fromstring(raw_data, size, "ARGB")
        surface.blit(surf, (x, y))
        
        plt.close(fig)
        
    def render_scroll_indicators(self, surface):
        """Render scroll indicators if content is off-screen"""
        global scrollable_surface_height
        
        if scrollable_surface_height > SCREEN_HEIGHT:
            # Show up indicator if we've scrolled down
            if scroll_y > 0:
                pygame.draw.polygon(surface, WHITE, [
                    (SCREEN_WIDTH // 2, 20),
                    (SCREEN_WIDTH // 2 - 15, 40),
                    (SCREEN_WIDTH // 2 + 15, 40)
                ])
                
            # Show down indicator if there's more content below
            if scroll_y < scrollable_surface_height - SCREEN_HEIGHT:
                pygame.draw.polygon(surface, WHITE, [
                    (SCREEN_WIDTH // 2, SCREEN_HEIGHT - 20),
                    (SCREEN_WIDTH // 2 - 15, SCREEN_HEIGHT - 40),
                    (SCREEN_WIDTH // 2 + 15, SCREEN_HEIGHT - 40)
                ])
    
    def render(self, surface):
        """Render the entire traffic system UI with vertical layout"""
        # Fill background
        surface.fill(BG_COLOR)
        
        # Calculate positions based on a vertical layout
        padding = 20
        
        # Draw title (always fixed at top)
        title_text = font_title.render("AI-Powered Traffic Signal Optimization", True, WHITE)
        surface.blit(title_text, (SCREEN_WIDTH/2 - title_text.get_width()/2, padding))
        
        # Status information (fixed at bottom)
        status_panel_height = 40
        scroll_indicator_margin = 20
        
        # Define layout coordinates (all y-coordinates will have scroll_y subtracted when rendering)
        title_height = 60
        start_y = title_height + padding
        
        # Traffic light size and position
        light_size = 80
        light_gap = 30
        light_row_width = (light_size * 4) + (light_gap * 3)
        light_start_x = (SCREEN_WIDTH - light_row_width) // 2
        
        # Position traffic lights in a row at the top
        for i in range(4):
            x = light_start_x + (i * (light_size + light_gap))
            y = start_y
            self.render_traffic_light(surface, x, y, i, light_size)
        
        # Video feeds - we'll display them in a 2x2 grid
        video_width = SCREEN_WIDTH // 2 - padding*1.5
        video_height = video_width * 3 // 4  # 4:3 aspect ratio
        
        # Starting y position for video grid (after traffic lights)
        video_start_y = start_y + light_size*2.5 + 100
        
        # Render video feeds in a 2x2 grid
        for i in range(4):
            row = i // 2
            col = i % 2
            x = padding + col * (video_width + padding)
            y = video_start_y + row * (video_height + padding*2)
            self.render_lane_video(surface, x, y, i, video_width, video_height)
        
        # Traffic stats - place below videos
        stats_width = SCREEN_WIDTH - padding*2
        stats_height = 300
        stats_y = video_start_y + 2 * (video_height + padding*2) + padding
        self.render_traffic_stats(surface, padding, stats_y, stats_width, stats_height)
        
        # Chart - place below stats
        chart_width = stats_width
        chart_height = 240
        chart_y = stats_y + stats_height + padding
        self.render_traffic_chart(surface, padding, chart_y, chart_width, chart_height)
        
        # Update the scrollable height based on content
        global scrollable_surface_height
        scrollable_surface_height = chart_y + chart_height + padding
        
        # Fixed position status bar at the bottom
        pygame.draw.rect(surface, BG_COLOR, (0, SCREEN_HEIGHT - status_panel_height, SCREEN_WIDTH, status_panel_height))
        
        # Status messages in fixed position
        if self.is_processing:
            status_text = font_medium.render("Processing video feed...", True, YELLOW)
            surface.blit(status_text, (SCREEN_WIDTH/2 - status_text.get_width()/2, SCREEN_HEIGHT - status_panel_height//2 - status_text.get_height()//2))
        elif self.remaining_time <= 5:
            status_text = font_medium.render(f"Switching to Lane {(self.current_lane_index + 1) % 4 + 1} in {int(self.remaining_time)} seconds...", True, YELLOW)
            surface.blit(status_text, (SCREEN_WIDTH/2 - status_text.get_width()/2, SCREEN_HEIGHT - status_panel_height//2 - status_text.get_height()//2))
        
        # Render instruction
        help_text = font_small.render("Mouse wheel to scroll | ESC to quit", True, WHITE)
        surface.blit(help_text, (SCREEN_WIDTH - help_text.get_width() - padding, SCREEN_HEIGHT - status_panel_height//2 - help_text.get_height()//2))
        
        # Render scroll indicators
        self.render_scroll_indicators(surface)
        
        pygame.display.flip()
        
def main():
    print("AI Traffic Signal Optimization System")
    print("-------------------------------------")
    
    # Initialize the traffic system
    traffic_system = TrafficSystem()
    
    # Main loop
    last_time = time.time()
    running = True
    
    # Global scroll variable
    global scroll_y, scrollable_surface_height, SCREEN_WIDTH, SCREEN_HEIGHT, screen
    scroll_y = 0
    
    try:
        while running:
            # Handle events
            for event in pygame.event.get():
                if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
                    running = False
                elif event.type == MOUSEWHEEL:
                    # Handle scrolling with mouse wheel
                    scroll_y -= event.y * SCROLL_SPEED
                    # Clamp scroll position
                    scroll_y = max(0, min(scroll_y, scrollable_surface_height - SCREEN_HEIGHT))
                elif event.type == VIDEORESIZE:
                    # Handle window resize - FIX: Made screen global to properly update it
                    SCREEN_WIDTH, SCREEN_HEIGHT = event.size
                    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.RESIZABLE)
            
            # Calculate time delta
            current_time = time.time()
            dt = current_time - last_time
            last_time = current_time
            
            # Update traffic system
            traffic_system.update(dt)
            
            # Render
            traffic_system.render(screen)
            
            # Cap the frame rate
            clock.tick(30)
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        # Clean up
        pygame.quit()
    
if __name__ == "__main__":
    main()