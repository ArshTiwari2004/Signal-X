// const int greenLed = 13;
// const int redLed = 9;
// const int buzzer = 12;

// bool ambulanceDetected = false;

// void setup() {
//   Serial.begin(9600);
//   pinMode(greenLed, OUTPUT);
//   pinMode(redLed, OUTPUT);
//   pinMode(buzzer, OUTPUT);
// }

// void loop() {
//   if (Serial.available() > 0) {
//     char signal = Serial.read();

//     if (signal == '1') {
//       ambulanceDetected = true;
//     } else if (signal == '0') {
//       ambulanceDetected = false;
//     }
//   }

//   if (ambulanceDetected) {
//     digitalWrite(greenLed, HIGH);   // Emergency active
//     digitalWrite(redLed, LOW);
//     digitalWrite(buzzer, HIGH);     // Buzzer ON
//   } else {
//     digitalWrite(greenLed, LOW);
//     digitalWrite(redLed, HIGH);     // No ambulance
//     digitalWrite(buzzer, LOW);      // Buzzer OFF
//   }
// }

// const int greenLed = 13;
// const int redLed = 9;
// const int buzzer = 12;
// const int soundSensor = 2;  // D0 pin of CZN-15E

// bool ambulanceDetected = false;  // From GUI
// bool sirenDetected = false;      // From sound sensor

// void setup() {
//   Serial.begin(9600);
//   pinMode(greenLed, OUTPUT);
//   pinMode(redLed, OUTPUT);
//   pinMode(buzzer, OUTPUT);
//   pinMode(soundSensor, INPUT);

//   // Default state
//   digitalWrite(greenLed, LOW);
//   digitalWrite(redLed, HIGH);
//   digitalWrite(buzzer, LOW);
// }

// void loop() {
//   // Check if GUI has sent a signal
//   if (Serial.available() > 0) {
//     char signal = Serial.read();
//     ambulanceDetected = (signal == '1');
//   }

//   // Check if sound is detected
//   sirenDetected = digitalRead(soundSensor) == HIGH;

//   // OR condition - either GUI or sound triggers it
//   if (ambulanceDetected || sirenDetected) {
//     digitalWrite(greenLed, HIGH);   // Go
//     digitalWrite(redLed, LOW);
//     digitalWrite(buzzer, HIGH);
//   } else {
//     digitalWrite(greenLed, LOW);
//     digitalWrite(redLed, HIGH);     // Stop
//     digitalWrite(buzzer, LOW);
//   }

//   delay(100);  // Small delay for stability
// }

// Final Code with LED+Buzzer+UltraSonic Sensors and Audio module

const int greenLed = 13;
const int redLed = 9;
const int buzzer = 12;
const int soundSensor = 2;  // D0 pin of CZN-15E

const int trigPin = 4;     // Ultrasonic Sensor TRIG
const int echoPin = 5;     // Ultrasonic Sensor ECHO

bool ambulanceDetected = false;  // From GUI
bool sirenDetected = false;      // From sound sensor

void setup() {
  Serial.begin(9600);

  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(soundSensor, INPUT);
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Default state
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, HIGH);
  digitalWrite(buzzer, LOW);
}

void loop() {
  // GUI input
  if (Serial.available() > 0) {
    char signal = Serial.read();
    ambulanceDetected = (signal == '1');
  }

  // Sound sensor input
  sirenDetected = digitalRead(soundSensor) == HIGH;

  // Distance measurement (ultrasonic)
  long duration;
  int distance;

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Action logic
  if (ambulanceDetected || sirenDetected) {
    digitalWrite(greenLed, HIGH);   // Go
    digitalWrite(redLed, LOW);
    digitalWrite(buzzer, HIGH);
  } else {
    digitalWrite(greenLed, LOW);
    digitalWrite(redLed, HIGH);     // Stop
    digitalWrite(buzzer, LOW);
  }

  delay(200);  // Delay for serial stability
}
