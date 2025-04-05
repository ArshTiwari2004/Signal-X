import numpy as np
import sounddevice as sd
import pygame
from scipy.fft import fft
from scipy.signal import spectrogram
import time
import matplotlib.pyplot as plt
from enum import Enum

class SirenType(Enum):
    AMBULANCE = 1
    FIRE_TRUCK = 2
    POLICE = 3
    NONE = 0

# Audio Configuration
SAMPLE_RATE = 44100
DURATION = 3.0  # seconds
CHANNELS = 1
THRESHOLD = 0.3  # Minimum volume threshold

# Siren Frequency Profiles (Hz)
SIREN_PROFILES = {
    SirenType.AMBULANCE: {
        'min_freq': 500,
        'max_freq': 1500,
        'pattern': 'wail'  # High-low pattern
    },
    SirenType.FIRE_TRUCK: {
        'min_freq': 800,
        'max_freq': 1200,
        'pattern': 'steady'  # Continuous wail
    },
    SirenType.POLICE: {
        'min_freq': 600,
        'max_freq': 1800,
        'pattern': 'hi-lo'  # Alternating pattern
    }
}

class SirenValidator:
    def __init__(self):
        pygame.mixer.init()
        self.recording = np.array([])
        self.fig, self.ax = plt.subplots(figsize=(10, 4))
        plt.ion()  # Interactive mode
        
    def record_audio(self):
        """Record audio from microphone"""
        print("Recording for 3 seconds...")
        self.recording = sd.rec(
            int(SAMPLE_RATE * DURATION),
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype='float32'
        )
        sd.wait()
        self.recording = np.squeeze(self.recording)
        print("Recording complete")
        
    def play_sample_siren(self, siren_type):
        """Play sample siren for testing"""
        file_map = {
            SirenType.AMBULANCE: "samples/ambulance.wav",
            SirenType.FIRE_TRUCK: "samples/firetruck.wav",
            SirenType.POLICE: "samples/police.wav"
        }
        
        try:
            sound = pygame.mixer.Sound(file_map[siren_type])
            sound.play()
            time.sleep(DURATION)
        except:
            print(f"Sample {siren_type.name} siren not available")

    def analyze_frequencies(self):
        """Analyze recorded audio for siren patterns"""
        if len(self.recording) == 0:
            return SirenType.NONE
        
        # Compute FFT
        n = len(self.recording)
        yf = fft(self.recording)
        xf = np.linspace(0, SAMPLE_RATE/2, n//2)
        magnitudes = 2/n * np.abs(yf[:n//2])
        
        # Visualize
        self.ax.clear()
        self.ax.plot(xf, magnitudes)
        self.ax.set_xlim(0, 3000)
        self.ax.set_title("Frequency Analysis")
        self.ax.set_xlabel("Frequency (Hz)")
        self.ax.set_ylabel("Magnitude")
        plt.pause(0.01)
        
        # Find dominant frequencies
        peak_freq = xf[np.argmax(magnitudes)]
        max_mag = np.max(magnitudes)
        
        if max_mag < THRESHOLD:
            return SirenType.NONE
            
        # Check against siren profiles
        for siren_type, profile in SIREN_PROFILES.items():
            if (profile['min_freq'] <= peak_freq <= profile['max_freq']):
                # Additional pattern verification would go here
                return siren_type
                
        return SirenType.NONE

    def live_detection(self):
        """Run continuous live detection"""
        print("Starting live siren detection...")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                self.record_audio()
                detected = self.analyze_frequencies()
                
                if detected != SirenType.NONE:
                    print(f"🚨 {detected.name} SIREN DETECTED!")
                    # Flash red for emergency
                    self.ax.set_facecolor((1, 0.8, 0.8))
                    plt.pause(0.1)
                    self.ax.set_facecolor((1, 1, 1))
                else:
                    print("No siren detected")
                
                plt.pause(0.5)
                
        except KeyboardInterrupt:
            print("\nStopping detection")

if __name__ == "__main__":
    validator = SirenValidator()
    
    # Demo mode selection
    print("WayGen Siren Validation System")
    print("1. Test with microphone")
    print("2. Play sample siren (ambulance)")
    print("3. Live detection mode")
    
    choice = input("Select mode (1-3): ")
    
    if choice == "1":
        validator.record_audio()
        result = validator.analyze_frequencies()
        print(f"Detection result: {result.name}")
        plt.show(block=True)
        
    elif choice == "2":
        validator.play_sample_siren(SirenType.AMBULANCE)
        
    elif choice == "3":
        validator.live_detection()