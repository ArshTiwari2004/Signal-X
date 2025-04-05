# import streamlit as st
# import cv2
# import numpy as np
# from traffic_detection import TrafficDetector

# # Page config
# st.set_page_config(page_title="Ambulance Detector 🚑", layout="wide")
# st.title("🚦 SignalX SOS - Ambulance Priority Detection")
# st.markdown("Upload a traffic image to detect ambulances and alert signals accordingly.")

# # Load YOLO model only once using session_state
# if 'detector' not in st.session_state:
#     with st.spinner("Loading YOLO model..."):
#         st.session_state.detector = TrafficDetector()

# # File uploader
# uploaded_file = st.file_uploader(
#     "📁 Upload a traffic image", 
#     type=["jpg", "jpeg", "png"],
#     accept_multiple_files=False
# )

# # Layout with columns
# col1, col2 = st.columns([1, 2])

# with col1:
#     if uploaded_file is not None:
#         # Display the uploaded image
#         st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
#         detect_button = st.button("🔍 Detect Ambulance", type="primary")
#     else:
#         st.info("Please upload an image to begin detection.")

# with col2:
#     result_placeholder = st.empty()
#     image_placeholder = st.empty()

#     if uploaded_file is not None and detect_button:
#         with st.spinner("Processing image..."):
#             # Read and decode image
#             file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
#             frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

#             # Run detection
#             detector = st.session_state.detector
#             vehicles_count, has_ambulance, processed_frame = detector.detect_vehicles(frame)

#             # Convert to RGB
#             processed_frame_rgb = cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB)

#             # Display processed image
#             image_placeholder.image(processed_frame_rgb, caption="Detection Result", use_column_width=True)

#             # Show result
#             if has_ambulance:
#                 result_placeholder.error("🚨 **Ambulance Detected!**\n\nEmergency vehicle in frame. Activate priority signal!")
#                 st.balloons()
#             else:
#                 result_placeholder.success(f"✅ **No Ambulance Detected**\n\n**Vehicles found:** {vehicles_count}")
#                 st.snow()

import streamlit as st
import cv2
import numpy as np
import time
import serial
from traffic_detection import TrafficDetector

# Streamlit page setup
st.set_page_config(page_title="Ambulance Detector", layout="wide")
st.title("🚑 SignalX SOS")
st.markdown("Upload a traffic image to check for ambulances/priority vehicles")

# Try to connect to Arduino
try:
    arduino = serial.Serial('COM5', 9600, timeout=1)  # Update COM port if needed
    time.sleep(2)  # Give time for Arduino to initialize
    st.success("✅ Arduino connected successfully.")
except Exception as e:
    arduino = None
    st.warning(f"⚠️ Could not connect to Arduino: {e}")

# Initialize YOLO Detector
detector = TrafficDetector()

# File uploader
uploaded_file = st.file_uploader(
    "Choose a traffic image...",
    type=["jpg", "jpeg", "png"],
    accept_multiple_files=False
)

# Output placeholders
result_placeholder = st.empty()
image_placeholder = st.empty()

# Button and detection logic
if uploaded_file is not None:
    if st.button("🔍 Detect Ambulance", type="primary"):
        with st.spinner("Processing image..."):
            # Convert file to OpenCV format
            file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
            frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

            # Detect vehicles and ambulances
            vehicles_count, has_ambulance, processed_frame = detector.detect_vehicles(frame)

            # Convert image to RGB for Streamlit display
            processed_frame_rgb = cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB)
            image_placeholder.image(processed_frame_rgb, caption="Processed Image", use_column_width=True)

            # Handle detection result
            if has_ambulance:
                result_placeholder.error("""
                ## 🚨 Ambulance Detected!
                Emergency vehicle detected in the image. 
                Priority signal should be activated!
                """)

                # Send '1' to Arduino
                if arduino:
                    try:
                        arduino.write(b'1')
                    except Exception as e:
                        st.error(f"Error sending data to Arduino: {e}")
            else:
                result_placeholder.success(f"""
                ## ✅ No Ambulance Detected
                Number of vehicles detected: {vehicles_count}
                """)

                # Send '0' to Arduino
                if arduino:
                    try:
                        arduino.write(b'0')
                    except Exception as e:
                        st.error(f"Error sending data to Arduino: {e}")

        st.balloons() if has_ambulance else st.snow()
