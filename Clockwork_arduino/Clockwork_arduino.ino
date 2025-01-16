

int leftRead;
int rightRead;

void setup() {

pinMode(A0, INPUT);


}

void loop() {

leftRead = map(analogRead(A0),0,1023,1,10);

 Serial.println(leftRead);


delay(50);
}
