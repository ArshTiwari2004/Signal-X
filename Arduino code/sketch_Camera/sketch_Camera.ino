void setup() {
    pinMode(13, OUTPUT);  // Set LED as OUTPUT
    pinMode(10, OUTPUT);  // Set Buzzer as OUTPUT
    Serial.begin(9600);   // Start Serial Communication

    Serial.println("Type 'ON' to turn LED and Buzzer ON, 'OFF' to turn them OFF.");
}

void loop() {
    if (Serial.available() > 0) {  // Check if data is available
        String command = Serial.readStringUntil('\n');  // Read the command
        command.trim();  // Remove extra spaces/newlines

        if (command.equalsIgnoreCase("ON")) {
            digitalWrite(13, HIGH);   // Turn LED ON
            tone(10, 1000);           // Play buzzer at 1kHz
            Serial.println("LED and Buzzer are now ON");
        } 
        else if (command.equalsIgnoreCase("OFF")) {
            digitalWrite(13, LOW);    // Turn LED OFF
            noTone(10);               // Stop buzzer sound
            Serial.println("LED and Buzzer are now OFF");
        }
        else {
            Serial.println("Invalid command! Type 'ON' or 'OFF'.");
        }
    }
}