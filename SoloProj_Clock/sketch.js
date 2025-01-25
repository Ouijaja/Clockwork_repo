
//let handsQuant = 15;
let gearQuant = 2;
let gearIndex;
let localRotation = 0;
let localRate, localScalePrevious;
let chimeQuant;
let chimeWav;
let allowChime = true;
let doneChimesCount = 0;
let time;
let dissonance = 0;
let daySpeedField, dayMoodField, daySigField, dayNoteField, gearVerScale;
let submitButton, displayButton;
let showText = 1;
let userData;
let clockhand, clockring, shadow, rusthand, rustRing, plate;
let pitchShifter;
let gearDistanceTranslation = 0;
let shiftVal = 0;
let totalMood = 0;
let avgMood = 0;
let colour = 0
let gearPosTotal = 0;
let audCont = false;
let totalSpeed = 0;
let ard, ardConnected = 0;

////// Controls


let motionBlur = 255; // 255 least, 0 most
let borderDistance = 200;
let gearDistance = 150;
let fps = 60;
let baseSpeed = 1.1;
//let concurrentChimes = 6;
let handDensity = 1; //exponential
//let dissonanceWeighting = 1.5; //exponent for weighting dissonance


//TODO:


//QUESTIONS:

//How to step through?


//**************************** */

function preload() {
  clockhand = loadImage('/assets/clockhand_gold_small.png');
  clockring = loadImage('/assets/ring_small.png');
  shadow = loadImage('/assets/Shadow.png');
  rusthand = loadImage('/assets/clockhand_rusted_small.png');
  //plate = loadImage('assets/Plate_small.png');
  rustRing = loadImage('/assets/RingRusted_small.png');
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

  port = createSerial();

  displayQuestion();




}


//***************************************** */


function draw() {

  background(220, 219, 206, motionBlur);


  if (showText == 1) {
    text('How quickly did your day pass, from 1 (lowest) to 10 (highest)?', 50, 50);
    //text("Today's speed: " + daySpeedField.value(), 50, 75);

    text('How would you rate your mood today from 1 (lowest) to 10 (highest)?', 50, 100);
    //text("Today's mood: " + dayMoodField.value(), 50, 125);

    text('How significant do you feel today was in your life,  from 1 (lowest) to 10 (highest)?', 50, 150);
    //text("Today's significance: " + daySigField.value(), 50, 175);

    text('Would you like to include a short note for the day (under  5 words)?', 50, 300);

    if (ardConnected == true) {
      let val = port.readUntil("\n");


      text("Today's speed: " + ard, 50, 75);
      text("Today's mood: " + ard, 50, 125);
      text("Today's significance: " + ard, 50, 175);


      if (val.length > 0) {

        ard = val;
        print(ard);

      }
    } else {

      text("Today's speed: " + daySpeedField.value(), 50, 75);
      text("Today's mood: " + dayMoodField.value(), 50, 125);
      text("Today's significance: " + daySigField.value(), 50, 175);

    }


  } else {

    translate(0, -1000 * gearVerScale.value()); // allows slider to scroll gears
    drawHand();

    if (minute() == 0 && second() == 0) {
      if (allowChime == true) {
        chimeQuant = hour();
        allowChime = false;
        playClockChime();
        print('clock should chime');


      }

    }


  }

}


//**************************************************** */


function windowResized() {
  resizeCanvas(innerWidth, innerHeight);

  if (showText == true) {
    removeElements();
    displayQuestion();
  } else {
    removeElements(gearVerScale);

    //gearVerScale = createSlider(0, 10, 0, 0);
    //gearVerScale.size(innerHeight/2, 30);
    //gearVerScale.position(-350 + innerHeight/2, innerHeight/2);

    //gearVerScale.style('transform', 'rotate(90deg)');


  }
}


//******************************************* */



function drawHand() {

  localRotation = localRotation + (fps / frameRate()); //increments rotation whilst accounting for lag
  let posStore = 0;
  for (g = 0; g < gearQuant; g++) {


    let localHandsCount = constrain(round(pow(10 - userData.Days[g].DaySpeed, handDensity)), 1,100); //sets the number of hands according to the day speed
    let localNotes = userData.Days[g].DayNote //gets the text for notes
    let localScale = pow(userData.Days[g].DaySig, 0.5) / 2 //sets the scale accoring to day significance

    //sets condiditions for first gear differently to subsequent gears

    //let localOffset = 250 + (350 * g)

    if (g == 0) {
      localRate = 1;
      posStore = borderDistance;

    } else {
      localRate = userData.Days[g - 1].DaySpeed / localHandsCount //sets gear ratio to neighbour
      localScalePrevious = pow(userData.Days[g - 1].DaySig, 0.5) / 2
    }


    gearDistanceTranslation = (gearDistance * (localScalePrevious + localScale)); // set the distance between gears

    //g*step count
    //let pos = 0
    //add translation to store , chcekc vs width 
    //keep and update current y
    //reset stored pos 

    translate(gearDistanceTranslation, 0);
    posStore = posStore + gearDistanceTranslation;
    if (posStore + (borderDistance / 2) >= innerWidth) {
      posStore = posStore - (innerWidth / 50);
      translate(borderDistance * 1.2 - posStore, 400);
      posStore = gearDistanceTranslation;
    }

    // set rotation speed
    //let rotSpeed = ((localRotation * localRate) / (localScale + localScalePrevious)) * baseSpeed;

    let rotSpeed = ((localRotation * pow(userData.Days[g].DaySpeed, 2)) / 10) / (localScale + localScalePrevious) * baseSpeed;
    //let localMood = map(userData.Days[g].DayMood, 1, 10, 0, 255);
    //let localColour = abs((sin(frameCount / (pow(11 - userData.Days[g].DaySpeed, 3)) * 10 + 1) * localMood));


    for (i = 0; i < localHandsCount; i++) {



      push();

      translate(0, 250);

      angleMode(DEGREES);


      //contents of if are  drawn first once per gear before scale
      if (i == 0) {



      }

      scale(localScale);

      //contents of if are drawn first once per gear after scale
      if (i == 0) {

        imageMode(CENTER);
        image(shadow, 0, 0, 512, 512);

        strokeWeight(0.5);
        stroke(0, 0, 0, 155);

        //textAlign(CENTER);
        //text(localNotes, 0, 150);
        rotateText(0, 0, 100, localNotes);


      }

      if (g % 2 == 0) {
        rotate(rotSpeed + (i * 360 / localHandsCount));
      }
      else {
        rotate(0 - (rotSpeed + (i * 360 / localHandsCount)));

      }
      imageMode(CORNER);
      //tint(localColour);
      if (userData.Days[g].DayMood >= 5) {
        image(clockhand, 0, 0, 128, 128);
      } else {
        image(rusthand, 0, 0, 128, 128);
      }

      //contents of if are drawn last once per gear
      if (i + 1 == localHandsCount) {


        imageMode(CENTER);
        if (userData.Days[g].DayMood >= 5) {
          image(clockring, 0, 0, 128, 128);
        } else {
          image(rustRing, 0, 0, 128, 128);

        }

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

  let arduinoButton = createButton('Connect Arduino');
  arduinoButton.position(width / 8, 400);
  arduinoButton.mousePressed(connectArduino);
  arduinoButton.size(300, 30);

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


  //USER DATA SAVE 

  saveJSON(userData,
    'userData.json', true);


  print('manually replace your userData file with the new one');



  //handsQuant = pow(daySpeedField.value(), 2);
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
    dissonance = dissonance + (10 - userData.Days[g].DayMood); // Ensures dissonance is inverse of mood and gets mean
    totalSpeed = totalSpeed + (userData.Days[g].DaySpeed); //Mean speed

  }

  dissonance = dissonance / gearQuant;
  print('Dissonance: ' + dissonance);
  //dissonance = map(pow(dissonance, dissonanceWeighting), 1, pow(10,dissonanceWeighting), 1, 10);
  //print('Weighted Dissonance: ' + dissonance);
  totalSpeed = totalSpeed / gearQuant;
  baseSpeed = baseSpeed * (totalSpeed / 10);
  print('Total Mean Speed: ' + totalSpeed);



  Tone.start();
  audCont = true;


}

//******************************* */

function displayClock() {
  print('Done!');
  showText = 0;

  removeElements();

  resetClock();
  playClockChime();
  resetClock();

  gearVerScale = createSlider(0, 10, 0, 0);
  gearVerScale.size(windowWidth - borderDistance, 30);
  gearVerScale.style('transform', 'rotate(90deg)');
  gearVerScale.position((-windowWidth / 2) + (borderDistance / 1.5), windowHeight / 2);

}

//********************************** */
async function playSound(shiftVal) {

  let PitchShifter = new Tone.PitchShift(shiftVal).toDestination();
  let player = new Tone.Player('/assets/chime_middleC.wav').connect(PitchShifter);

  player.autostart = true;

}


///////////////////////////////////////////////////

async function playClockChime() {

  if (audCont == false) {
    Tone.start();
    audCont = true;
  }


  let interLoop = setInterval(function () {




    setDissonance();
    playSound(shiftVal);
    doneChimesCount++
    print('Chime ' + (doneChimesCount) + ' of ' + chimeQuant + ' Shifted ' + shiftVal + ' semitones');

    if (chimeQuant > 12 && chimeQuant - doneChimesCount >= 2) {

      setDissonance();
      playSound(shiftVal);
      doneChimesCount++;
      print('Chime ' + (doneChimesCount) + ' of ' + chimeQuant + ' Shifted ' + shiftVal + ' semitones');

    }


    if (doneChimesCount >= chimeQuant) {
      clearInterval(interLoop);
      resetClock();
    }

  }, ((80000 / chimeQuant) / totalSpeed));



}


////******************* */

function resetClock() {

  allowChime = true;
  doneChimesCount = 0;
  print('chime reset')

}

//******************** */

function setDissonance() {

  shiftVal = 0;
  let randSign = round(random(0, 1));
  let selector = round(random(0, 6));

  if (dissonance == 0) {

    if (selector == 0) {
      shiftVal = 0;
    } else if (selector <= 1) {
      shiftVal = 5;
    } else {
      shiftVal = 7;
    }

  } else if (dissonance < 5) {
    if (selector == 0) {
      shiftVal = 0;
    } else if (selector <= 1) {
      shiftVal = 5;
    } else if (selector <= 3) {
      shiftVal = 7;
    } else if (selector <= 5) {
      shiftVal = 3;
    } else {
      shiftVal = 12;
    }


  } else if (dissonance < 6) {

    if (selector == 0) {
      shiftVal = 0;
    } else if (selector == 1) {
      shiftVal = 5;
    } else if (selector == 2) {
      shiftVal = 7;
    } else if (selector == 3) {
      shiftVal = 3;
    } else if (selector == 4) {
      shiftVal = 10;
    } else {
      shiftVal = 12;
    };


  } else if (dissonance < 8) {

    if (selector == 0) {
      shiftVal = 4;
    } else if (selector == 1) {
      shiftVal = 5;
    } else if (selector == 2) {
      shiftVal = 7;
    } else if (selector == 3) {
      shiftVal = 3;
    } else if (selector == 4) {
      shiftVal = 10;
    } else if (selector == 5) {
      shiftVal = 9;
    } else {
      shiftVal = 12;
    };

  } else if (dissonance < 9) {

    if (selector == 0) {
      shiftVal = 4;
    } else if (selector == 1) {
      shiftVal = 5;
    } else if (selector == 2) {
      shiftVal = 2;
    } else if (selector == 3) {
      shiftVal = 3;
    } else if (selector == 4) {
      shiftVal = 10;
    } else if (selector == 5) {
      shiftVal = 9;
    } else {
      shiftVal = 12;
    };

  } else {
    shiftVal = random(0, 23);
  }

  // randomises pitch shift up or down
  if (randSign == 0) {
    shiftVal = shiftVal;
  } else {
    shiftVal = (0 - shiftVal);
  }


}

//////////////////////////////////////

//Function from https://editor.p5js.org/Arkimedz/sketches/0VHgrQruB
function rotateText(x, y, radius, txt) {

  // Split the chars so they can be printed one by one
  chars = txt.split("");

  // Decide an angle
  charSpacingAngleDeg = 250;

  textAlign(CENTER, BASELINE);
  textSize(15);
  fill(101,51,51);

  push();

  // Let's first move to the center of the circle
  translate(x, y)

  // First rotate half back so that middle char will come in the center
  rotate(radians(-chars.length * charSpacingAngleDeg / 2));

  for (let i = 0; i < chars.length; i++) {
    text(chars[i], 0, -radius);

    // Then keep rotating forward per character
    rotate(radians(charSpacingAngleDeg));
  }

  // Reset all translations we did since the last push() call
  // so anything we draw after this isn't affected
  pop();

}

////////////////////////////////

function connectArduino() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
    ardConnected = true;
  } else {
    port.close();
    ardConnected = false;
  }

}