import pygame
import math
import random
from collections import deque

class AmbulanceCorridorSim:
    def __init__(self):
        pygame.init()
        self.width, self.height = 1200, 600
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("SignalX Emergency Corridor Simulation")
        
        # Hospital and ambulance
        self.hospital = pygame.Rect(1000, 250, 100, 100)
        self.ambulance = {"pos": [100, 300], "speed": 5, "active": False}
        
        # Traffic lights (x_pos, green_time, original_time)
        self.lights = [
            {"rect": pygame.Rect(300, 250, 30, 100), "green": 60, "original": 60},
            {"rect": pygame.Rect(500, 250, 30, 100), "green": 45, "original": 45}, 
            {"rect": pygame.Rect(700, 250, 30, 100), "green": 30, "original": 30},
            {"rect": pygame.Rect(900, 250, 30, 100), "green": 15, "original": 15}
        ]
        
        # Traffic queue at each light
        self.queues = [deque(maxlen=8) for _ in range(4)]
        
        # Visualization parameters
        self.font = pygame.font.SysFont('Arial', 24)
        self.clock = pygame.time.Clock()
    
    def spawn_vehicles(self):
        """Generate random traffic"""
        for i, light in enumerate(self.lights):
            if random.random() < 0.02 and len(self.queues[i]) < 8:
                self.queues[i].append(1)
    
    def update_ambulance(self):
        """Move ambulance and trigger light adjustments"""
        if self.ambulance["active"]:
            self.ambulance["pos"][0] += self.ambulance["speed"]
            
            # Dynamic light adjustment based on distance
            for i, light in enumerate(self.lights):
                dist = light["rect"].x - self.ambulance["pos"][0]
                if 0 < dist < 400:  # Within 400px
                    # Progressive time reduction formula
                    light["green"] = max(10, light["original"] * (1 - (i+1)*0.25))
                    
                    # Clear traffic queue
                    if random.random() < 0.3:
                        self.queues[i].pop() if self.queues[i] else None
    
    def draw(self):
        """Render simulation"""
        self.screen.fill((240, 240, 240))
        
        # Draw road
        pygame.draw.rect(self.screen, (50, 50, 50), (0, 275, self.width, 50))
        
        # Draw hospital
        pygame.draw.rect(self.screen, (255, 0, 0), self.hospital)
        pygame.draw.rect(self.screen, (255, 255, 255), self.hospital, 2)
        
        # Draw ambulance
        if self.ambulance["active"]:
            pygame.draw.rect(self.screen, (255, 0, 0), 
                           (*self.ambulance["pos"], 50, 30))
            siren = pygame.Surface((50, 10), pygame.SRCALPHA)
            siren.fill((255, 255, 0, 128))
            self.screen.blit(siren, (self.ambulance["pos"][0], self.ambulance["pos"][1]-10))
        
        # Draw traffic lights and queues
        for i, (light, queue) in enumerate(zip(self.lights, self.queues)):
            # Light pole
            pygame.draw.rect(self.screen, (0, 0, 0), light["rect"])
            
            # Signal (green if ambulance is approaching)
            color = (0, 255, 0) if (self.ambulance["active"] and 
                                   light["rect"].x > self.ambulance["pos"][0]) else (255, 0, 0)
            pygame.draw.circle(self.screen, color, 
                             (light["rect"].x+15, light["rect"].y+30), 10)
            
            # Queue visualization
            for j, _ in enumerate(queue):
                pygame.draw.rect(self.screen, (0, 100, 255), 
                               (light["rect"].x-50-j*20, 300, 15, 25))
            
            # Display adjusted timing
            text = self.font.render(f"{light['green']}s", True, (0, 0, 0))
            self.screen.blit(text, (light["rect"].x-20, light["rect"].y-30))
        
        # Legend
        legend = [
            "Red/Green: Traffic Signals",
            "Blue Boxes: Waiting Vehicles",
            "Red Box: Ambulance (SPACE to activate)",
            "Progressive Time Reduction: 60s → 45s → 30s → 15s"
        ]
        for i, text in enumerate(legend):
            surf = self.font.render(text, True, (0, 0, 0))
            self.screen.blit(surf, (20, 20 + i*30))
        
        pygame.display.flip()
    
    def run(self):
        """Main loop"""
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE and not self.ambulance["active"]:
                        self.ambulance["active"] = True
            
            self.spawn_vehicles()
            self.update_ambulance()
            self.draw()
            self.clock.tick(30)
            
            # Reset after ambulance reaches hospital
            if self.ambulance["pos"][0] > self.width:
                self.ambulance = {"pos": [100, 300], "speed": 5, "active": False}
                for light in self.lights:
                    light["green"] = light["original"]
        
        pygame.quit()

if __name__ == "__main__":
    sim = AmbulanceCorridorSim()
    sim.run()