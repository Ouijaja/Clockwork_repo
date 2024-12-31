
let handsQuant = 15;
let gearQuant = 2;
let slider;
let gearIndex;
let localRotation = 0;
let localRate, localScalePrevious;
let chimeQuant;
let chimeWav;
let allowChime = true;
let doneChimesCount = 0;
let time;

let daySpeedField, dayMoodField, daySigField, dayNoteField;
let submitButton;
let displayButton;
let showText = 1;
let userData;
let clockhand;

////// Controls


let motionBlur = 255;
//let borderDistance = 200;
let gearDistance = 150;
let fps = 60;
let baseSpeed = 2;


//TODO:
//

//**************************** */

function preload() {
  clockhand = loadImage('/assets/ClockhandV2_small.png');
  userData = loadJSON('userData.json');
  chimeWav = loadSound('/assets/chime_middleC.wav')

}

//**************************************

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  gearQuant = (userData.Days.length);

time = millis();


  displayQuestion();




}


//***************************************** */


function draw() {

  background(220, 220, 220, motionBlur);


  if (showText == 1) {
    text('How quickly did your day pass, from 1 (lowest) to 10 (highest)?', 50, 50);
    text("Today's speed: " + daySpeedField.value(), 50, 75);

    text('How would you rate your mood today from 1 (lowest) to 10 (highest)?', 50, 100);
    text("Today's mood: " + dayMoodField.value(), 50, 125);

    text('How significant do you feel today was in your life,  from 1 (lowest) to 10 (highest)?', 50, 150);
    text("Today's significance: " + daySigField.value(), 50, 175);

    text('Would you like to include a short note for the day (under  5 words)?', 50, 300);


  } else {

    localRotation = localRotation + 60 / frameRate(); //increments rotation whilst accounting for lag 
    drawHand();
    print(second());

    if (second() == 30) {
      if (allowChime == true) {
        chimeQuant = hour();
        allowChime = false;
        playClockChime();
        print('clock should chime');
      }

    }

    if (second() == 0) {
      allowChime = true;
      doneChimesCount = 0;
      print('chime allowed')
    }








  }

}


//**************************************************** */


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (showText == true) {
    removeElements();
    displayQuestion();
  }
}


//******************************************* */



function drawHand() {




  for (g = 0; g < gearQuant; g++) {


    let localHandsCount = userData.Days[g].DaySpeed //sets the number of hands according to the day speed
    let localNotes = userData.Days[g].DayNote //gets the text for notes
    let localScale = pow(userData.Days[g].DaySig, 0.5) / 2 //sets the scale accoring to day significance

    //sets condiditions for first gear differently to subsequent gears
    //let localOffset = 250 + (350 * g)

    if (g == 0) {
      localRate = 1;

    } else {
      localRate = userData.Days[g - 1].DaySpeed / localHandsCount //sets gear ratio to neighbour
      localScalePrevious = pow(userData.Days[g - 1].DaySig, 0.5) / 2
    }


    translate(gearDistance * (localScalePrevious + localScale), 0);



    let rotSpeed = ((localRotation * localRate) / (localScale + localScalePrevious)) * baseSpeed;





    for (i = 0; i < localHandsCount; i++) {

      push();

      translate(0, 250);

      angleMode(DEGREES);

      text(gearDistance * (localScalePrevious + localScale), 0, 150);



      if (g % 2 == 0) {
        rotate(rotSpeed + (i * 360 / localHandsCount));
      }
      else {
        rotate(0 - (rotSpeed + (i * 360 / localHandsCount)));

      }
      strokeWeight(1);
      stroke(0, 0, 0, 255)

      scale(localScale);
      image(clockhand, 0, 0);

      //contents of if are only drawn once per gear
      if (i < 1) {

        fill(255);
        circle(0, 0, 20);
        noFill();
        strokeWeight(18);
        stroke(0, 0, 0, 200)
        circle(0, 0, 192);
        strokeWeight(1);
        text(localNotes, 30, 30);



      }

      pop();


    }

  }
}

//************************* */

function displayQuestion() {

  daySpeedField = createSlider(1, 10, 5, 1)
  daySpeedField.position(width / 2.3, 180);
  daySpeedField.size(250);

  dayMoodField = createSlider(1, 10, 5, 1);
  dayMoodField.position(width / 2.3, 220);
  dayMoodField.size(250);

  daySigField = createSlider(1, 10, 5, 1);
  daySigField.position(width / 2.3, 260);
  daySigField.size(250);

  dayNoteField = createInput('')
  dayNoteField.position(width / 2.3, 325);
  dayNoteField.size(250, 50)


  submitButton = createButton('Submit');
  submitButton.position(width / 2.3, 400);
  submitButton.mousePressed(submitData);


}

//******************** */

function submitData() {


  let date = new Date();
  date = date.toDateString().slice(4);
  print('submitted ' + date);



  //userData update
  userData.Days.push({
    'DayDate': date,
    'DaySpeed': daySpeedField.value(),
    'DayMood': dayMoodField.value(),
    'DaySig': daySigField.value(),
    'DayNote': dayNoteField.value()
  });


  saveJSON(userData,
    'userData.json', true);


  print('manually replace your userData file with the new one');



  handsQuant = pow(daySpeedField.value(), 2);



  removeElements(submitButton);

  displayButton = createButton('DONE');
  displayButton.position(100, 200)
  displayButton.mousePressed(displayClock);


}

//******************************* */

function displayClock() {
  print('Done!');
  showText = 0;

  removeElements();


}

//********************************** */

function playClockChime() {

  for (doneChimesCount; doneChimesCount < chimeQuant;) {

    if (millis() - time >= 500) {


      chimeWav.play();
      doneChimesCount++;

      print('Chimed at: ' + chimeQuant + ':00');
      print(doneChimesCount);
      print(chimeQuant);

      time = millis();
    }
  }
}

