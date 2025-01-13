
let handsQuant = 15;
let gearQuant = 2;
let gearIndex;
let localRotation = 0;
let localRate, localScalePrevious;
let chimeQuant;
let chimeWav;
let allowChime = true;
let doneChimesCount = 0;
let time;
let dissonance;
let daySpeedField, dayMoodField, daySigField, dayNoteField, gearHorizScale;
let submitButton, displayButton;
let showText = 1;
let userData;
let clockhand;
let pitchShifter;
let gearDistanceTranslation = 0;
let totalMood = 0;
let avgMood = 0;
let colour = 0
let gearPosTotal = 0;

////// Controls


let motionBlur = 255;
//let borderDistance = 200;
let gearDistance = 150;
let fps = 60;
let baseSpeed = 2;
let concurrentChimes = 3;
let handDensity = 1; //exponential


//TODO:


//BUGS:
//Freezes when chiming
//How to get on new line? Total translation doesn't add per gear, but per frame
//How to step through?

//**************************** */

function preload() {
  clockhand = loadImage('/assets/ClockhandV2White_small.png');
  userData = loadJSON('userData.json');

}

//**************************************

function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  //gearQuant = (userData.Days.length);
  gearQuant = 5;
  chimeQuant = hour()
  time = millis();
  //pitchShifter = new p5.PitchShifter();
  //chimeWav.disconnect();
  //chimeWav.connect(pitchShifter);



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

    translate(- 1000 * gearHorizScale.value(), 0); // allows slider to scroll gears
    drawHand();
    //print(second());
    /*
        if (minute() == 0 && second() == 55) {
          if (allowChime == true) {
            chimeQuant = hour();
            allowChime = false;
            playClockChime();
            print('clock should chime');
          }
    
        }
    
        if (second() == 30) {
          resetClock();
        }
    
    
    */





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

  localRotation = localRotation + (60 / frameRate()); //increments rotation whilst accounting for lag

  for (g = 0; g < gearQuant; g++) {


    let localHandsCount = round(pow(10 - userData.Days[g].DaySpeed, handDensity)) //sets the number of hands according to the day speed
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


    gearDistanceTranslation = (gearDistance * (localScalePrevious + localScale)); // set the distance between gears



    translate(gearDistanceTranslation, 0);

    // set rotation speed
    //let rotSpeed = ((localRotation * localRate) / (localScale + localScalePrevious)) * baseSpeed;

    let rotSpeed = ((localRotation * (userData.Days[g].DaySpeed)) / 10) / (localScale + localScalePrevious) * baseSpeed;
    let localMood = map(userData.Days[g].DayMood, 1, 10, 0, 255);
    let localColour = abs((sin(frameCount / (pow(11 - userData.Days[g].DaySpeed, 3)) * 10 + 1) * localMood));


    for (i = 0; i < localHandsCount; i++) {

      push();

      translate(0, 250);

      angleMode(DEGREES);


      textAlign(CENTER);
      text(localNotes, 0, 150);


      if (g % 2 == 0) {
        rotate(rotSpeed + (i * 360 / localHandsCount));
      }
      else {
        rotate(0 - (rotSpeed + (i * 360 / localHandsCount)));

      }
      strokeWeight(1);
      stroke(0, 0, 0, 255)

      scale(localScale);
      tint(localColour);
      image(clockhand, 0, 0);

      //contents of if are only drawn once per gear
      if (i + 1 == localHandsCount) {

        fill(255);
        circle(0, 0, 20);
        noFill();
        strokeWeight(18);
        stroke(localColour, 200);
        circle(0, 0, 192);
        strokeWeight(1);




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



  //userData update////////////////////////////////////////////////////////
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
  gearQuant = (userData.Days.length);

  for (g = 0; g < gearQuant; g++) {

    totalMood = totalMood + userData.Days[g].DayMood;
  }

  avgMood = totalMood / gearQuant;
  colour = map(avgMood, 1, 10, 0, 255);


  removeElements(submitButton);

  displayButton = createButton('DONE');
  displayButton.position(100, 200)
  displayButton.mousePressed(displayClock);

  for (g = 0; g < gearQuant; g++) {
    dissonance = dissonance + (10 - userData.Days[g].DayMood);

  }

  Tone.start();


}

//******************************* */

function displayClock() {
  print('Done!');
  showText = 0;

  removeElements();

  resetClock();
  playClockChime();
  resetClock();

  gearHorizScale = createSlider(0, 10, 0, 0);
  gearHorizScale.position(50, 50);
  gearHorizScale.size(windowWidth - 100, 30);

}

//********************************** */

function playClockChime() {


  for (doneChimesCount = 0; doneChimesCount < 5;) {

    if (millis() - time >= 1000) {

      let shiftVal = doneChimesCount;
      playSound(shiftVal);

      print('debugChime ' + (doneChimesCount + 1) + ' of ' + chimeQuant);
      time = millis();
      doneChimesCount++
    }
  }
}
/*
for (doneChimesCount; doneChimesCount < chimeQuant;) {
 
  let persistCount = 0;
 
  let shiftVal = -5;
  let PitchShifter = new Tone.PitchShift(shiftVal).toDestination();
  let player1 = new Tone.Player('/assets/chime_middleC.wav').connect(PitchShifter);
  
  //let player2 = new Tone.Player('/assets/chime_middleC.wav').connect(PitchShifter);
 
  if (millis() - time >= 5000 / chimeQuant) {
 
 
      if (persistCount < concurrentChimes) {
 
      persistCount++
 
    } else {
 
      //player1.autostart = false;
     // player2.autostart = false;
      persistCount = 0;
 
    }
 
 
    //setDissonance(shiftVal);
 
 
    
 
    player1.autostart = true;
    doneChimesCount++;
 
    //Plays another chime overlapping the first
    if (chimeQuant > 12 && chimeQuant - doneChimesCount >= 2) {
 
      //player2.autostart = true;
      doneChimesCount++;
    }
 
 
    print('Chimed at: ' + chimeQuant + ':00');
    print('chimes done: ' + doneChimesCount);
    print('chime quant: ' + chimeQuant);
    print('persistCount: ' + persistCount);
    print('Dissonance: ' + dissonance);
 
    time = millis();
 
 
 
 
 
  }
 
 
}
 
 
}
*/

////******************* */

function resetClock() {

  allowChime = true;
  doneChimesCount = 0;
  print('chime reset')

}

//******************** */

function setDissonance(shiftVal) {
  print(shiftVal);
  let randSign = random(0, 1);

  if (dissonance == 0) {

    if (doneChimesCount % 10 == 0) {
      shiftVal = 12;
    } else {
      shiftVal = 5 * doneChimesCount;

    }

  } else if (dissonance < 5) {

    shiftVal = 5 * doneChimesCount;

  } else if (dissonance < 8) {

    shiftVal = random(5, 12);

  } else {
    shiftVal = random(0, 12) * (random(1, 10) / 10);
  }

  // randomises pitch shift up or down
  if (randSign == 0) {
    shiftVal = shiftVal;
  } else {
    shiftVal = 0 - shiftVal;
  }
}

//////////////////////////////////////

function playSound(shiftVal) {

  let PitchShifter = new Tone.PitchShift(shiftVal).toDestination();
  let player = new Tone.Player('/assets/chime_middleC.wav').connect(PitchShifter);

  
  player.autostart = true;

}