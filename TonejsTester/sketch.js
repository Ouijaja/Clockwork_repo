let button;
let chimeWav;
let player;


function setup() {
  button = createButton('Play');
  button.mouseClicked(startAudio);
  
  



}

function startAudio() {

  Tone.start();
  let shiftVal = -12;
  let PitchShifter = new Tone.PitchShift(shiftVal).toDestination();
  player = new Tone.Player('/assets/chime_middleC.wav').connect(PitchShifter);
  

 
  player.autostart = true;
}