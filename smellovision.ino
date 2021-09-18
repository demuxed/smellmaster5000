#include <DRV8835MotorShield.h>

DRV8835MotorShield motors;

const int ledPin = 13;
const int motorSpeed = 200;

// Setup the LED, reset the spray head, and setup the seial port.
void setup() {
  pinMode(ledPin, OUTPUT);
  resetSprayHead();
  Serial.begin(9600);
}

// Listen for messages on the serial interface to trigger some smells!
void loop() {
    while(Serial.available()){
        char data = Serial.read();
        switch(data){
            case 'A':
              spray('A');
              break;
        }
    }
}

// Resets the spray head to the starting (up) position.
// I _think_ this is how the actual AirWick device operates, but I haven't dug too deeply.
void resetSprayHead() {
  motors.setM1Speed(-motorSpeed);
  delay(1000);
  motors.setM1Speed(0);
}

// Dispense some scent!
void spray(char device) {
  digitalWrite(ledPin, HIGH);
  motors.setM1Speed(motorSpeed);
  delay(500);
  motors.setM1Speed(-motorSpeed);
  delay(500);
  motors.setM1Speed(0);
  digitalWrite(ledPin, LOW);
}
