
let handsQuant = 15;
let slider;
let gearIndex;
let localRotation = 0;
let localRate = 1;
let fps = 60;



//**************************** */

function preload(){
  clockhand = loadImage ('/assets/ClockhandV2_small.png')
}

//**************************************

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);







  //slider for display only
  /*
  slider = createSlider(1,550);
  slider.position(width/3, height/5);
  slider.size(250);
  */



  
}


//***************************************** */


function draw() {
  background(220);
  //handsQuant = slider.value(); //slider for display only
  localRotation = localRotation + 60/frameRate(); //increments rotation whilst accounting for lag 
  drawHand(handsQuant);
  
  
}


//**************************************************** */


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


//******************************************* */



function drawHand(handsQuant){
  
  
  let rotSpeed = localRotation * localRate;

  for(i = 0; i < handsQuant; i++){
    //gearIndex[i] = createGraphics()
  push();
  translate(width/2, height/2);
  circle(0,0,20);
  pop();
  push();
  translate((width/2), (height/2));
  angleMode(DEGREES);
  rotate(rotSpeed +i*360/handsQuant);
  image(clockhand,0,0);
  pop();
  
}

//************************* */


}