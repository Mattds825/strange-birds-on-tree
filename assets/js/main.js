const scrollableSquare = document.getElementById("main-content");
const body = document.getElementById("body");
const storyText = document.getElementById("story-text");
const startBtn = document.getElementById("start-btn");
let currentTextIndex = -1; // Initialize with an invalid index
let isSoundPlaying = false;
let glitchEffect = false;
let isGlitching = false;

const textOptions = [
  "I had a Strange Dream",
  "There was a small window with a Tree",
  "Birds started appering on the tree and singing",
  "Each bird itself a Unique Vision",
  "I Thought to myself: These are some strange Birds!",
];


startBtn.addEventListener("click", () => {
  startAudioContext();
});

//create audio player that loads file
const player = new Tone.Player({
  url: "assets/sounds/birds.mp3", // Replace with the path to your MP3 file
  autostart: false,
});

//create effects
const lowPassFilter = new Tone.Filter(20000, "lowpass"); // High frequency by default (not affecting sound)
const pitchShift = new Tone.PitchShift(); // Create a PitchShift effect with default settings 
const distortion = new Tone.Distortion(0); 
distortion.wet.value = 0; // set the wet value to 0 to start with no distortion

//chain the effects to the player
player.chain(lowPassFilter, pitchShift, Tone.Destination);

// function to start the AudioContext
async function startAudioContext() {
  await Tone.start();
  scrollableSquare.style.display = "block";
  startBtn.style.display = "none";  
}

// Function to play the loaded audio file
function playSound(){
  player.start();
  setVolume(0);
}


// Function to set the volume
function setVolume(volume) {
  volume = Math.max(0, Math.min(volume, 1));
  const volInDb = Tone.gainToDb(volume); // Convert linear value to decibels
  player.volume.value = volInDb;
}

// Function to set the low-pass filter frequency
// `amount` should be a value between 0 and 100, where 0 is no effect (max frequency) and 100 is full effect (minimum frequency)
function setLowPassFilter(amount) {
  const maxFrequency = 20000; // Maximum human-audible frequency
  const minFrequency = 2000; // Minimum human-audible frequency
  // Clamp the amount between 0 and 100 to avoid invalid values
  amount = Math.max(0, Math.min(amount, 100));

  // Calculate the frequency value, ensuring it stays within valid range
  const frequency = minFrequency + (maxFrequency - minFrequency) * (1 - amount / 100);

  // Ensure the frequency stays within the acceptable range for the filter
  lowPassFilter.frequency.value = Math.max(minFrequency, Math.min(frequency, maxFrequency));
}

// Function to set pitch shift based on scroll percentage
// `value` should be between 0.5 (no shift) and 1 (full shift of -12 semitones)
function setPitchShift(amount) {
  amount = Math.max(0, Math.min(amount, 1));
  console.log("setting pitch shift", amount);
  // Only apply pitch shift if the value is greater than 0.5
  if (amount > 0.5) {
      // Calculate the pitch shift amount based on the value
      const shiftAmount = -24 * (amount - 0.5) / 0.5; // Maps value from 0 to -12 semitones

      // Set the pitch shift effect
      pitchShift.pitch = shiftAmount;
  } else {
      // No pitch shift if value is 0.5 or less
      pitchShift.pitch = 0;
  }
}

// Function to set distortion based on a value
// `value` should be between 0.5 (no distortion) and 1 (maximum distortion)
function setDistortion(amount) {
  amount = Math.max(0, Math.min(amount, 1));

  if (amount > 0.5) {
      // Calculate the distortion amount based on the value
      const distortionAmount = (amount - 0.5) / 0.5; // Maps value from 0 to 1
      distortion.distortion = distortionAmount;
      // Increase the wet value proportionally
      distortion.wet.value = distortionAmount;
  } else {
      distortion.distortion = 0; // No distortion if value is 0.5 or less
      distortion.wet.value = 0;
  }
}

//fuction to add glitch effect
function addGlitchEffect() {
  if(!isGlitching){
    scrollableSquare.style.backgroundColor = "white";
    setTimeout(() => {
      console.log("glitching");
      isGlitching = true;
      scrollableSquare.style.backgroundColor = "black";
      hadlingGlitch = false;
      
    }, 100);
    // isGlitching = false;
    // addGlitchEffect();
  }
}

scrollableSquare.addEventListener("scroll", () => {
  const scrollTop = scrollableSquare.scrollTop;
  const scrollHeight =
    scrollableSquare.scrollHeight - scrollableSquare.clientHeight;

  const startColor =  { r: 71, g: 89, b: 115 };// Grayish blue
  const endColor = { r: 135, g: 206, b: 250 }; // Sky blue

  const blackColor = { r: 0, g: 0, b: 0 };

  const scrollPercentage = scrollTop / scrollHeight;

  // Map the scroll percentage (0 to 1) to the range 20 to 80
  const bgBackgroundPercentage = Math.round(40 + scrollPercentage * (80 - 40));

  const newColor = {
    r: Math.round(
      startColor.r + (endColor.r - startColor.r) * scrollPercentage
    ),
    g: Math.round(
      startColor.g + (endColor.g - startColor.g) * scrollPercentage
    ),
    b: Math.round(
      startColor.b + (endColor.b - startColor.b) * scrollPercentage
    ),
  };

  // update body background
  body.style.background = `radial-gradient(circle, rgba(126,126,126,1) 3%, rgba(0,0,0,1) ${bgBackgroundPercentage}%)`;

  // update scrollable square background
  scrollableSquare.style.backgroundColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;

  // Update the story text based on scroll percentage
  let newTextIndex;
  if (scrollPercentage <= 0.01) {
    newTextIndex = 0;
    // startAudioContext();
    playSound();
  } else if (scrollPercentage <= 0.25) {
    newTextIndex = 1;
    glitchEffect = false;
  } else if (scrollPercentage <= 0.5) {
    newTextIndex = 2;
    glitchEffect = false;
  } else if (scrollPercentage <= 0.75) {
    newTextIndex = 3;
    glitchEffect = false;
  } else {
    newTextIndex = 4;
    glitchEffect = false;
  }

  if (scrollPercentage >= 0.95) {
    glitchEffect = true;
  }
  // Only update the text if it has changed
  if (newTextIndex !== currentTextIndex) {
    storyText.style.opacity = 0; // Fade out
    setTimeout(() => {
      storyText.textContent = textOptions[newTextIndex];
      storyText.style.opacity = 1; // Fade in
    }, 500); // Match the transition duration
    currentTextIndex = newTextIndex;
  }


  if(glitchEffect){
    // addGlitchEffect();
    scrollableSquare.style.animation="glitch 0.2s infinite";
    console.log("glitching");
  }else{
    scrollableSquare.style.animation="none";
  }

  //adjust the volume based on scroll percentage
  setVolume(0.001 + scrollPercentage * 0.9);
  setLowPassFilter(scrollPercentage * 100);
  setPitchShift(scrollPercentage);
  setDistortion(scrollPercentage);
});
