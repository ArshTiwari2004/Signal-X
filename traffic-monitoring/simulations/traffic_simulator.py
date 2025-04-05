import pygame
import random
import time
import csv
from datetime import datetime

class TrafficSimulator:
    def __init__(self):
        pygame.init()
        self.WIDTH, self.HEIGHT = 1000, 800
        self.screen = pygame.display.set_mode((self.WIDTH, self.HEIGHT))
        pygame.display.set_caption("SignalX AI Traffic Control - Enhanced")
        
        # Colors and fonts
        self.BG_COLOR = (40, 40, 40)
        self.ROAD_COLOR = (50, 50, 50)
        self.LANE_COLOR = (255, 255, 0)
        self.CAR_COLORS = [(0, 120, 255), (0, 180, 60), (180, 120, 0)]
        self.AMBULANCE_COLOR = (255, 40, 40)
        self.SIGNAL_COLORS = {'red': (200, 0, 0), 'yellow': (230, 230, 0), 'green': (0, 180, 0)}
        self.font = pygame.font.SysFont('Arial', 18)
        self.alert_font = pygame.font.SysFont('Arial', 32, bold=True)
        
        # Simulation parameters
        self.BASE_TIME = 10
        self.TIME_PER_VEHICLE = 3
        self.MIN_GREEN_TIME = 10
        self.MAX_GREEN_TIME = 60
        self.EMERGENCY_DURATION = 20  # seconds
        
        # Intersection layout with buffer zones
        self.intersection_rect = pygame.Rect(400, 300, 200, 200)
        self.stop_lines = {
            1: pygame.Rect(450, 250, 100, 5),  # North
            2: pygame.Rect(650, 350, 5, 100),   # East
            3: pygame.Rect(450, 550, 100, 5),   # South
            4: pygame.Rect(350, 350, 5, 100)    # West
        }
        
        # Lane definitions with proper spacing
        self.lanes = {
            1: {'rect': pygame.Rect(450, 0, 100, 250), 'direction': 'down', 'signal': 'red', 
                'time_left': 0, 'vehicles': [], 'next_capture': 0},
            2: {'rect': pygame.Rect(650, 350, 350, 100), 'direction': 'left', 'signal': 'red', 
                'time_left': 0, 'vehicles': [], 'next_capture': 0},
            3: {'rect': pygame.Rect(450, 550, 100, 250), 'direction': 'up', 'signal': 'red', 
                'time_left': 0, 'vehicles': [], 'next_capture': 0},
            4: {'rect': pygame.Rect(0, 350, 350, 100), 'direction': 'right', 'signal': 'green', 
                'time_left': self.BASE_TIME, 'vehicles': [], 'next_capture': self.BASE_TIME - 5}
        }
        
        # Emergency and performance tracking
        self.emergency_mode = False
        self.performance_data = {
            'total_vehicles': 0,
            'emergencies_handled': 0,
            'avg_wait_time': 0,
            'throughput': []
        }
        
        # Data logging
        self.setup_data_logging()
        
        # Pre-load vehicle shapes
        self.vehicle_shapes = {
            'car': self.create_vehicle_shape(60, 30, False),
            'ambulance': self.create_vehicle_shape(70, 35, True)
        }
    
    def create_vehicle_shape(self, width, height, is_ambulance):
        """Create different shaped vehicles"""
        shape = pygame.Surface((width, height), pygame.SRCALPHA)
        if is_ambulance:
            pygame.draw.rect(shape, self.AMBULANCE_COLOR, (0, 0, width, height))
            pygame.draw.rect(shape, (255, 255, 255), (10, 5, 15, 5))  # Cross symbol
            pygame.draw.rect(shape, (255, 255, 255), (45, 5, 15, 5))
            pygame.draw.rect(shape, (255, 255, 255), (10, 15, 50, 5))
        else:
            color = random.choice(self.CAR_COLORS)
            pygame.draw.rect(shape, color, (0, 0, width, height))
            # Add windows
            pygame.draw.rect(shape, (200, 200, 255), (5, 5, 20, 15))
            pygame.draw.rect(shape, (200, 200, 255), (35, 5, 20, 15))
        return shape
    
    def setup_data_logging(self):
        """Initialize data collection"""
        self.log_file = open('traffic_data.csv', 'w')
        self.log_writer = csv.writer(self.log_file)
        self.log_writer.writerow([
            'timestamp', 'lane', 'vehicle_count', 'signal_state', 
            'signal_time', 'has_emergency', 'green_time_assigned',
            'emergency_handled', 'wait_time'
        ])
    
    def calculate_green_time(self, lane_id):
        """Adaptive timing formula with constraints"""
        vehicle_count = len(self.lanes[lane_id]['vehicles'])
        green_time = self.BASE_TIME + (vehicle_count * self.TIME_PER_VEHICLE)
        return max(self.MIN_GREEN_TIME, min(green_time, self.MAX_GREEN_TIME))
    
    def spawn_vehicle(self, lane_id, is_emergency=False):
        """Add a new vehicle with collision avoidance"""
        lane = self.lanes[lane_id]
        
        # Check for space before spawning
        if lane['vehicles']:
            last_vehicle = lane['vehicles'][-1]
            min_distance = 120 if is_emergency else 80
            
            if lane['direction'] in ['down', 'up']:
                if abs(last_vehicle['rect'].y - (0 if lane['direction'] == 'down' else self.HEIGHT)) < min_distance:
                    return
            else:
                if abs(last_vehicle['rect'].x - (0 if lane['direction'] == 'right' else self.WIDTH)) < min_distance:
                    return
        
        # Create vehicle
        vehicle_type = 'ambulance' if is_emergency else 'car'
        vehicle = {
            'rect': None,
            'speed': random.uniform(2, 3.5),
            'is_emergency': is_emergency,
            'type': vehicle_type,
            'wait_time': 0,
            'entered_intersection': False
        }
        
        # Position based on lane direction
        shape = self.vehicle_shapes[vehicle_type]
        if lane['direction'] == 'down':
            vehicle['rect'] = pygame.Rect(lane['rect'].x + 20, -shape.get_height(), 
                                        shape.get_width(), shape.get_height())
        elif lane['direction'] == 'up':
            vehicle['rect'] = pygame.Rect(lane['rect'].x + 20, self.HEIGHT, 
                                        shape.get_width(), shape.get_height())
        elif lane['direction'] == 'left':
            vehicle['rect'] = pygame.Rect(self.WIDTH, lane['rect'].y + 20, 
                                        shape.get_height(), shape.get_width())
        else:  # right
            vehicle['rect'] = pygame.Rect(-shape.get_height(), lane['rect'].y + 20, 
                                        shape.get_height(), shape.get_width())
        
        lane['vehicles'].append(vehicle)
        self.performance_data['total_vehicles'] += 1
        
        # Handle emergency
        if is_emergency:
            self.emergency_mode = True
            self.performance_data['emergencies_handled'] += 1
            self.lanes[lane_id]['next_capture'] = 0  # Immediate detection
            
            # Visual alert
            self.emergency_start_time = time.time()
            # Uncomment for sound: pygame.mixer.Sound('sounds/siren.mp3').play()
    
    def update_vehicles(self):
        """Move vehicles with proper stopping and collision avoidance"""
        current_time = time.time()
        
        for lane_id, lane in self.lanes.items():
            for i, vehicle in enumerate(lane['vehicles']):
                # Skip if this vehicle is being processed for removal
                if vehicle.get('remove', False):
                    continue
                
                # Check if vehicle should stop at red light
                should_stop = False
                stop_line = self.stop_lines[lane_id]
                
                if lane['signal'] == 'red' and not vehicle['entered_intersection']:
                    if lane['direction'] == 'down' and vehicle['rect'].bottom >= stop_line.top:
                        should_stop = True
                    elif lane['direction'] == 'up' and vehicle['rect'].top <= stop_line.bottom:
                        should_stop = True
                    elif lane['direction'] == 'left' and vehicle['rect'].left <= stop_line.right:
                        should_stop = True
                    elif lane['direction'] == 'right' and vehicle['rect'].right >= stop_line.left:
                        should_stop = True
                
                # Check for vehicle ahead
                if i > 0 and not should_stop:
                    vehicle_ahead = lane['vehicles'][i-1]
                    min_distance = 30 if vehicle['is_emergency'] else 20
                    
                    if lane['direction'] == 'down':
                        if vehicle_ahead['rect'].bottom - vehicle['rect'].bottom < min_distance:
                            should_stop = True
                    elif lane['direction'] == 'up':
                        if vehicle['rect'].top - vehicle_ahead['rect'].top < min_distance:
                            should_stop = True
                    elif lane['direction'] == 'left':
                        if vehicle['rect'].left - vehicle_ahead['rect'].left < min_distance:
                            should_stop = True
                    elif lane['direction'] == 'right':
                        if vehicle_ahead['rect'].right - vehicle['rect'].right < min_distance:
                            should_stop = True
                
                # Update position if not stopped
                if not should_stop:
                    if lane['direction'] == 'down':
                        vehicle['rect'].y += vehicle['speed']
                    elif lane['direction'] == 'up':
                        vehicle['rect'].y -= vehicle['speed']
                    elif lane['direction'] == 'left':
                        vehicle['rect'].x -= vehicle['speed']
                    elif lane['direction'] == 'right':
                        vehicle['rect'].x += vehicle['speed']
                    
                    # Mark as entered intersection
                    if not vehicle['entered_intersection'] and self.intersection_rect.colliderect(vehicle['rect']):
                        vehicle['entered_intersection'] = True
                else:
                    vehicle['wait_time'] += 1/30  # Increment wait time (assuming 30 FPS)
                
                # Check if vehicle exited screen
                if (vehicle['rect'].top > self.HEIGHT + 50 or 
                    vehicle['rect'].bottom < -50 or 
                    vehicle['rect'].left > self.WIDTH + 50 or 
                    vehicle['rect'].right < -50):
                    vehicle['remove'] = True
        
            # Remove vehicles marked for deletion
            lane['vehicles'] = [v for v in lane['vehicles'] if not v.get('remove', False)]
    
    def update_signals(self):
        """Update traffic signals with your AI logic"""
        current_time = time.time()
        
        # Emergency override handling
        if self.emergency_mode:
            if current_time - self.emergency_start_time < self.EMERGENCY_DURATION:
                for lane_id, lane in self.lanes.items():
                    has_emergency = any(v['is_emergency'] for v in lane['vehicles'])
                    if has_emergency:
                        lane['signal'] = 'green'
                        lane['time_left'] = self.EMERGENCY_DURATION - (current_time - self.emergency_start_time)
                        lane['next_capture'] = 0
                    else:
                        lane['signal'] = 'red'
                        lane['time_left'] = 0
                return
            else:
                self.emergency_mode = False
        
        # Normal adaptive signal control
        for lane_id, lane in self.lanes.items():
            if lane['signal'] == 'green':
                lane['time_left'] -= 1/30  # Decrement by frame time
                
                # Check if time to capture next lane (5 seconds before end)
                if lane['time_left'] <= 5 and lane['next_capture'] == 0:
                    next_lane = (lane_id % 4) + 1
                    print(f"AI Camera capturing Lane {next_lane}...")
                    lane['next_capture'] = 1  # Mark as captured
                
                # Time's up for this green signal
                if lane['time_left'] <= 0:
                    lane['signal'] = 'yellow'
                    lane['time_left'] = 3  # 3 seconds of yellow
                    lane['next_capture'] = 0
            elif lane['signal'] == 'yellow':
                lane['time_left'] -= 1/30
                if lane['time_left'] <= 0:
                    lane['signal'] = 'red'
                    
                    # Switch to lane with most vehicles
                    next_lane = max(self.lanes.keys(), 
                                  key=lambda x: len(self.lanes[x]['vehicles']))
                    self.lanes[next_lane]['signal'] = 'green'
                    green_time = self.calculate_green_time(next_lane)
                    self.lanes[next_lane]['time_left'] = green_time
                    self.lanes[next_lane]['next_capture'] = green_time - 5 if green_time > 5 else 0
    
    def draw(self):
        """Draw the complete simulation with enhanced visuals"""
        self.screen.fill(self.BG_COLOR)
        
        # Draw roads with better markings
        pygame.draw.rect(self.screen, self.ROAD_COLOR, pygame.Rect(0, 300, self.WIDTH, 200))
        pygame.draw.rect(self.screen, self.ROAD_COLOR, pygame.Rect(400, 0, 200, self.HEIGHT))
        
        # Draw lane markings (dashed lines)
        for y in range(0, self.HEIGHT, 40):
            pygame.draw.rect(self.screen, self.LANE_COLOR, (490, y, 20, 20))
        for x in range(0, self.WIDTH, 40):
            pygame.draw.rect(self.screen, self.LANE_COLOR, (x, 390, 20, 20))
        
        # Draw intersection with crosswalk
        pygame.draw.rect(self.screen, (70, 70, 70), self.intersection_rect)
        for i in range(410, 590, 20):
            pygame.draw.rect(self.screen, (220, 220, 220), (i, 400, 10, 5))
            pygame.draw.rect(self.screen, (220, 220, 220), (i, 500, 10, 5))
            pygame.draw.rect(self.screen, (220, 220, 220), (400, i, 5, 10))
            pygame.draw.rect(self.screen, (220, 220, 220), (600, i, 5, 10))
        
        # Draw stop lines
        for line in self.stop_lines.values():
            pygame.draw.rect(self.screen, (255, 0, 0), line)
        
        # Draw vehicles with proper shapes and labels
        for lane_id, lane in self.lanes.items():
            for vehicle in lane['vehicles']:
                # Rotate vehicle based on direction
                if lane['direction'] in ['left', 'right']:
                    vehicle_surface = pygame.transform.rotate(self.vehicle_shapes[vehicle['type']], 
                                                            90 if lane['direction'] == 'left' else 270)
                else:
                    vehicle_surface = pygame.transform.rotate(self.vehicle_shapes[vehicle['type']], 
                                                            180 if lane['direction'] == 'up' else 0)
                
                self.screen.blit(vehicle_surface, vehicle['rect'].topleft)
                
                # Label emergency vehicles
                if vehicle['is_emergency']:
                    label = self.font.render("AMBULANCE", True, (255, 255, 255))
                    self.screen.blit(label, (vehicle['rect'].x - 10, vehicle['rect'].y - 20))
        
        # Draw traffic signals with info
        signal_positions = {
            1: (450, 280),  # North
            2: (700, 350),  # East
            3: (450, 520),  # South
            4: (300, 350)   # West
        }
        
        for lane_id, pos in signal_positions.items():
            lane = self.lanes[lane_id]
            
            # Draw signal
            pygame.draw.circle(self.screen, self.SIGNAL_COLORS[lane['signal']], pos, 20)
            
            # Draw signal info
            time_text = self.font.render(f"{int(lane['time_left'])}s", True, (255, 255, 255))
            self.screen.blit(time_text, (pos[0] - 10, pos[1] + 25))
            
            # Draw vehicle count
            count_text = self.font.render(f"Vehicles: {len(lane['vehicles'])}", True, (255, 255, 255))
            self.screen.blit(count_text, (pos[0] - 30, pos[1] - 40))
            
            # Indicate if next for capture
            if lane['next_capture'] > 0:
                capture_text = self.font.render(f"Next: {int(lane['next_capture'])}s", True, (200, 200, 255))
                self.screen.blit(capture_text, (pos[0] - 20, pos[1] - 60))
        
        # Draw emergency alert
        if self.emergency_mode:
            alert_text = self.alert_font.render("EMERGENCY VEHICLE - PRIORITY ACTIVE", True, (255, 50, 50))
            self.screen.blit(alert_text, (self.WIDTH//2 - 250, 20))
        
        # Draw performance stats
        stats_text = [
            f"Total Vehicles: {self.performance_data['total_vehicles']}",
            f"Emergencies: {self.performance_data['emergencies_handled']}",
            f"Avg Wait Time: {self.performance_data['avg_wait_time']:.1f}s"
        ]
        
        for i, text in enumerate(stats_text):
            stat_surface = self.font.render(text, True, (255, 255, 255))
            self.screen.blit(stat_surface, (self.WIDTH - 200, 20 + i * 25))
        
        pygame.display.flip()
    
    def log_data(self):
        """Log traffic data for analysis"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        for lane_id, lane in self.lanes.items():
            has_emergency = any(v['is_emergency'] for v in lane['vehicles'])
            avg_wait = sum(v['wait_time'] for v in lane['vehicles']) / max(1, len(lane['vehicles']))
            
            self.log_writer.writerow([
                timestamp,
                lane_id,
                len(lane['vehicles']),
                lane['signal'],
                lane['time_left'],
                has_emergency,
                self.calculate_green_time(lane_id) if lane['signal'] == 'green' else 0,
                self.emergency_mode,
                avg_wait
            ])
        
        # Update performance data
        total_wait = sum(v['wait_time'] for lane in self.lanes.values() for v in lane['vehicles'])
        total_vehicles = sum(len(lane['vehicles']) for lane in self.lanes.values())
        self.performance_data['avg_wait_time'] = total_wait / max(1, total_vehicles)
    
    def run(self):
        """Main simulation loop"""
        clock = pygame.time.Clock()
        running = True
        last_spawn_time = time.time()
        last_emergency_spawn = time.time()
        
        while running:
            current_time = time.time()
            
            # Spawn regular vehicles
            if current_time - last_spawn_time > 1.2:  # Every 1.2 seconds
                lane_id = random.choice(list(self.lanes.keys()))
                self.spawn_vehicle(lane_id)
                last_spawn_time = current_time
            
            # Spawn emergency vehicles less frequently
            if current_time - last_emergency_spawn > 15:  # Every 15 seconds
                if random.random() < 0.3:  # 30% chance
                    lane_id = random.choice(list(self.lanes.keys()))
                    self.spawn_vehicle(lane_id, True)
                    last_emergency_spawn = current_time
            
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        # Manual emergency for demo
                        lane_id = random.choice(list(self.lanes.keys()))
                        self.spawn_vehicle(lane_id, True)
                    elif event.key == pygame.K_p:
                        # Pause simulation
                        paused = True
                        while paused:
                            for e in pygame.event.get():
                                if e.type == pygame.KEYDOWN and e.key == pygame.K_p:
                                    paused = False
                            pygame.time.wait(100)
            
            # Update simulation
            self.update_vehicles()
            self.update_signals()
            self.log_data()
            self.draw()
            
            clock.tick(30)  # Maintain 30 FPS
        
        self.log_file.close()
        pygame.quit()

if __name__ == "__main__":
    simulator = TrafficSimulator()
    simulator.run() 