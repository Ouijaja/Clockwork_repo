
let handsQuant = 15;
let slider;
let gearIndex;
let localRotation = 0;
let localRate = 1;
let fps = 60;
let daySpeedField;
let dayMoodField;
let submitButton;
let showText = 1;


//**************************** */

function preload() {
  clockhand = loadImage('/assets/ClockhandV2_small.png')
}

//**************************************

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);


  displayQuestion();
  //daySpeedField.position(width/3,100);
  //daySpeedField.size(500, 50);

  //dayMoodField.position(width/3,200);
  //dayMoodField.size(500,50)




  //slider for display only
  /*
  slider = createSlider(1,550);
  slider.position(width/3, height/5);
  slider.size(250);
  */




}


//***************************************** */


function draw() {

  background(220, 220, 220);
  //handsQuant = slider.value(); //slider for display only
  localRotation = localRotation + 60 / frameRate(); //increments rotation whilst accounting for lag 
  drawHand(handsQuant);
  if (showText == 1) {
    text('How quickly did your day pass, from 1 (lowest) to 10 (highest)?', 50, 50);
    text("Today's speed: " + daySpeedField.value(), 50, 75);

    text('How would you rate your mood today from 1 (lowest) to 10 (highest)?', 50, 100);
    text("Today's mood: " + dayMoodField.value(), 50, 125);
  }
}


//**************************************************** */


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


//******************************************* */



function drawHand(handsQuant) {

  //localRate = 
  let rotSpeed = localRotation * localRate;

  for (i = 0; i < handsQuant; i++) {
    //gearIndex[i] = createGraphics()
    push();
    translate(width / 2, height / 2);
    circle(0, 0, 20);
    pop();
    push();
    translate((width / 2), (height / 2));
    angleMode(DEGREES);
    rotate(rotSpeed + i * 360 / handsQuant);
    image(clockhand, 0, 0);
    pop();

  }
}

//************************* */

function displayQuestion() {

  daySpeedField = createSlider(1, 10, 5, 1)
  daySpeedField.position(width / 3, height / 5);
  daySpeedField.size(250);

  dayMoodField = createSlider(1, 10, 5, 1);
  dayMoodField.position(width / 3, height / 4);
  dayMoodField.size(250);

  submitButton = createButton('Submit');
  submitButton.position(100, 200)
  submitButton.mousePressed(submitData);
}

//******************** */

function submitData() {


  let date = new Date();
  date = date.toDateString().slice(4);
  print('submitted ' + date);



}
