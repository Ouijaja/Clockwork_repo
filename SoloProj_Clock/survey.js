//Code for online survey used by participants 

let daySpeedField, dayMoodField, daySigField, dayNoteField, gearHorizScale;
let submitButton, displayButton;
let userData;
let yesterday = false;
let autoYst = false;

function preload() {
  userData = loadJSON("userData.json");
}

function setup() {
  createCanvas(600, 500);

  daySpeedField = createSlider(1, 10, 5, 1);
  daySpeedField.position(width / 2.3, 60);
  daySpeedField.size(250);

  dayMoodField = createSlider(1, 10, 5, 1);
  dayMoodField.position(width / 2.3, 110);
  dayMoodField.size(250);

  daySigField = createSlider(1, 10, 5, 1);
  daySigField.position(width / 2.3, 160);
  daySigField.size(250);

  dayNoteField = createInput("");
  dayNoteField.position(width / 2.3, 325);
  dayNoteField.size(250, 50);

  submitButton = createButton("Submit for Today");
  submitButton.position(width / 2.3, 400);
  submitButton.mousePressed(submitToday);

  submitButtonY = createButton("Submit for Yesterday");
  submitButtonY.position(width / 2.3, 450);
  submitButtonY.mousePressed(submitYesterday);
  

 
}

function draw() {
  background(220);

  textSize(15);
  fill(0);
  text(
    "How quickly did your day pass, from 1 (lowest) to 10 (highest)?",
    50,
    50
  );
  text("Today's speed: " + daySpeedField.value(), 50, 75);

  text(
    "How would you rate your mood today from 1 (lowest) to 10 (highest)?",
    50,
    100
  );
  text("Today's mood: " + dayMoodField.value(), 50, 125);

  text(
    "How significant do you feel today was in your life,  from 1 (lowest) to 10 (highest)?",
    50,
    150
  );
  text("Today's significance: " + daySigField.value(), 50, 175);

  text(
    "Optionally, would you like to include a short note for the day (under  5 words)?",
    50,
    300
  );

  text("or", width / 2, 440);

  fill(255, 0, 0);
  textSize(30);
}

function submitData() {
  let date = new Date();
  date = date.toDateString().slice(4);
  print("submitted " + date);

  //userData update
  userData.Days.push({
    DayDate: date,
    DaySpeed: daySpeedField.value(),
    DayMood: dayMoodField.value(),
    DaySig: daySigField.value(),
    DayNote: dayNoteField.value(),
    Yesterday: yesterday,
    AutoYesterday: autoYst,
  });

  saveJSON(userData, "userData.json");

  print("send Calan the file please :)");
  print(userData);

  removeElements();

  displayButton = createButton("DONE");
  displayButton.position(100, 200);
  displayButton.mousePressed(location.reload());
}

function submitYesterday() {
  yesterday = true;
  submitData();
}

function submitToday() {
  if (hour() < 10) {
    autoYst = "hour " + hour();
    submitYesterday();
  } else {
    submitData();
  }
}
