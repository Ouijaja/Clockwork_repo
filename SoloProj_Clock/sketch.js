
let handsQuant = 15;
let gearQuant = 2;
let slider;
let gearIndex;
let localRotation = 0;
let localRate;
let fps = 60;
let daySpeedField, dayMoodField, daySigField, dayNoteField;
let submitButton;
let displayButton;
let showText = 1;
let userData;
let clockhand;

//TODO:
//

//**************************** */

function preload() {
  clockhand = loadImage('/assets/ClockhandV2_small.png');
  userData = loadJSON('userData.json');

}

//**************************************

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  gearQuant = (userData.Days.length);




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

    
  }

}


//**************************************************** */


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if(showText == true){
    removeElements();
    displayQuestion();
  }
}


//******************************************* */



function drawHand() {


  for (g = 0; g < gearQuant; g++) {

    if (g < userData.Days.length) {


    }

    
    let localHandsCount = userData.Days[g].DaySpeed

    if (g == 0){
       localRate = 1;
    } else{
     localRate = userData.Days[g-1].DaySpeed / localHandsCount
  }

    let rotSpeed = localRotation * localRate;
    

    for (i = 0; i < localHandsCount; i++) {
      print('Gear ' + g + ' localrate: ' + localRate);
      push();
      translate(250 + (300 * g), 250);
      circle(0, 0, 20);
      angleMode(DEGREES);
      if (g % 2 == 0) {
        rotate(rotSpeed + i * 360 / localHandsCount);
      }
      else {
        rotate(0 - (rotSpeed + i * 360 / localHandsCount));

      }
      image(clockhand, 0, 0);
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
  dayNoteField.size(250,50)


  submitButton = createButton('Submit');
  submitButton.position(width/2.3, 400);
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
    'Note': dayNoteField.value()
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

  removeElements(dayMoodField);
  removeElements(daySpeedField);
  removeElements(displayButton);

}
