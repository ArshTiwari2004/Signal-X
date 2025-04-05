import pygame
import time
import os
from enum import Enum
from dataclasses import dataclass

# Initialize pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 700
LANE_COLORS = {
    'A': (255, 100, 100),  # Red
    'B': (100, 255, 100),  # Green
    'C': (100, 100, 255),  # Blue
    'D': (255, 255, 100)   # Yellow
}

class EmergencyType(Enum):
    AMBULANCE = 1
    ORGAN_TRANSPORT = 2
    FIRE_TRUCK = 3
    POLICE = 4
    DISASTER_RESPONSE = 5

@dataclass
class EmergencyVehicle:
    lane: str
    vehicle_type: EmergencyType
    arrival_time: float = None
    image: pygame.Surface = None
    
    def __post_init__(self):
        self.arrival_time = time.time()
        self.image = self._load_image()
    
    def _load_image(self):
        """Load appropriate vehicle image based on type"""
        size = (120, 60)
        img = pygame.Surface(size, pygame.SRCALPHA)
        
        # Draw different vehicle types
        if self.vehicle_type == EmergencyType.AMBULANCE:
            img.fill((255, 0, 0))
            pygame.draw.rect(img, (255, 255, 255), (10, 20, 100, 20))
            font = pygame.font.SysFont('Arial', 18)
            text = font.render("AMBULANCE", True, (0, 0, 0))
            img.blit(text, (15, 25))
        elif self.vehicle_type == EmergencyType.FIRE_TRUCK:
            img.fill((200, 0, 0))
            pygame.draw.rect(img, (255, 255, 0), (30, 10, 60, 40))
        elif self.vehicle_type == EmergencyType.POLICE:
            img.fill((0, 0, 150))
            pygame.draw.rect(img, (255, 255, 255), (40, 10, 40, 40))
        else:
            img.fill((100, 100, 100))
        
        return img

def determine_priority(vehicles):
    """Returns the vehicle with highest priority"""
    if not vehicles:
        return None
    return min(vehicles, key=lambda x: (x.vehicle_type.value, x.arrival_time))

def draw_junction(screen):
    """Draw the traffic junction visualization"""
    # Draw lanes
    pygame.draw.rect(screen, (50, 50, 50), (300, 100, 400, 400))  # Junction area
    
    # Lane markings
    for i, lane in enumerate(['A', 'B', 'C', 'D']):
        x = 300 + (i % 2) * 400
        y = 100 + (i // 2) * 400
        width = 40 if i % 2 else 400
        height = 400 if i % 2 else 40
        pygame.draw.rect(screen, LANE_COLORS[lane], (x, y, width, height))
        
        # Lane labels
        font = pygame.font.SysFont('Arial', 30)
        text = font.render(f"Lane {lane}", True, (255, 255, 255))
        screen.blit(text, (x + width//2 - 40, y + height//2 - 15))

def draw_vehicles(screen, vehicles):
    """Draw all vehicles at their respective lanes"""
    lane_positions = {
        'A': (500, 500),  # Bottom
        'B': (500, 100),  # Top
        'C': (100, 300),  # Left
        'D': (700, 300)   # Right
    }
    
    for vehicle in vehicles:
        pos = lane_positions[vehicle.lane]
        screen.blit(vehicle.image, (pos[0] - 60, pos[1] - 30))

def draw_priority_indicator(screen, priority_vehicle):
    """Highlight the priority vehicle"""
    if not priority_vehicle:
        return
        
    lane_positions = {
        'A': (500, 500),
        'B': (500, 100),
        'C': (100, 300),
        'D': (700, 300)
    }
    
    pos = lane_positions[priority_vehicle.lane]
    pygame.draw.circle(screen, (0, 255, 0), pos, 15, 3)
    
    # Draw green signal for priority lane
    signal_pos = {
        'A': (450, 450),
        'B': (450, 150),
        'C': (150, 250),
        'D': (650, 250)
    }
    pygame.draw.circle(screen, (0, 255, 0), signal_pos[priority_vehicle.lane], 20)

def draw_legend(screen):
    """Draw the color legend for vehicle types"""
    font = pygame.font.SysFont('Arial', 20)
    y_pos = 520
    for i, vehicle_type in enumerate(EmergencyType):
        color = [(255,0,0), (255,100,100), (200,0,0), (0,0,150), (100,100,100)][i]
        pygame.draw.rect(screen, color, (50, y_pos, 20, 20))
        screen.blit(font.render(f"= {vehicle_type.name}", True, (255,255,255)), (80, y_pos))
        y_pos += 30

def main():
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("WayGen Emergency Priority Demo")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont('Arial', 24)
    
    # Sample vehicles - Edit these for different test cases
    active_vehicles = [
        EmergencyVehicle('A', EmergencyType.AMBULANCE),
        EmergencyVehicle('C', EmergencyType.FIRE_TRUCK)
    ]
    
    running = True
    while running:
        screen.fill((0, 0, 0))
        
        # Draw junction and vehicles
        draw_junction(screen)
        draw_vehicles(screen, active_vehicles)
        
        # Determine and display priority
        priority_vehicle = determine_priority(active_vehicles)
        draw_priority_indicator(screen, priority_vehicle)
        
        # Display information
        y_pos = 20
        screen.blit(font.render("WayGen Emergency Vehicle Priority System", True, (255,255,255)), (50, y_pos))
        y_pos += 40
        screen.blit(font.render("Active Emergency Vehicles:", True, (255,255,255)), (50, y_pos))
        
        for vehicle in active_vehicles:
            y_pos += 30
            color = (0,255,0) if vehicle == priority_vehicle else (255,255,255)
            screen.blit(font.render(f"- {vehicle.vehicle_type.name} on Lane {vehicle.lane}", True, color), (70, y_pos))
        
        if priority_vehicle:
            y_pos += 50
            screen.blit(font.render(f"Priority Granted to:", True, (0,255,0)), (50, y_pos))
            y_pos += 30
            screen.blit(font.render(f"{priority_vehicle.vehicle_type.name} on Lane {priority_vehicle.lane}", True, (0,255,0)), (70, y_pos))
        
        draw_legend(screen)
        
        # Control instructions
        y_pos = 520
        screen.blit(font.render("Controls:", True, (255,255,255)), (400, y_pos))
        y_pos += 30
        screen.blit(font.render("1-5: Add vehicles (1=Ambulance, 2=Organ, 3=Fire, 4=Police, 5=Disaster)", True, (200,200,255)), (400, y_pos))
        y_pos += 30
        screen.blit(font.render("Arrow Keys: Change lane (Up=A, Down=B, Left=C, Right=D)", True, (200,200,255)), (400, y_pos))
        y_pos += 30
        screen.blit(font.render("SPACE: Clear all | ESC: Exit", True, (200,200,255)), (400, y_pos))
        
        pygame.display.flip()
        
        # Event handling
        current_lane = 'A'  # Default lane
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            if event.type == pygame.KEYDOWN:
                # Lane selection
                if event.key == pygame.K_UP:
                    current_lane = 'A'
                elif event.key == pygame.K_DOWN:
                    current_lane = 'B'
                elif event.key == pygame.K_LEFT:
                    current_lane = 'C'
                elif event.key == pygame.K_RIGHT:
                    current_lane = 'D'
                
                # Vehicle addition
                elif event.key == pygame.K_1:
                    active_vehicles.append(EmergencyVehicle(current_lane, EmergencyType.AMBULANCE))
                elif event.key == pygame.K_2:
                    active_vehicles.append(EmergencyVehicle(current_lane, EmergencyType.ORGAN_TRANSPORT))
                elif event.key == pygame.K_3:
                    active_vehicles.append(EmergencyVehicle(current_lane, EmergencyType.FIRE_TRUCK))
                elif event.key == pygame.K_4:
                    active_vehicles.append(EmergencyVehicle(current_lane, EmergencyType.POLICE))
                elif event.key == pygame.K_5:
                    active_vehicles.append(EmergencyVehicle(current_lane, EmergencyType.DISASTER_RESPONSE))
                
                # Controls
                elif event.key == pygame.K_SPACE:
                    active_vehicles = []
                elif event.key == pygame.K_ESCAPE:
                    running = False
        
        clock.tick(30)

    pygame.quit()

if __name__ == "__main__":
    main()