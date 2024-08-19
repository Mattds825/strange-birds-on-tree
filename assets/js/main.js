const scrollableSquare = document.getElementById("main-content");
const body = document.getElementById("body");
const storyText = document.getElementById("story-text");
const startBtn = document.getElementById("start-btn");
let currentTextIndex = -1; // Initialize with an invalid index
let isSoundPlaying = false;

const textOptions = [
  "I had a Strange Dream",
  "There was a small window with a Tree",
  "Birds started appering on the tree and singing",
  "Each bird itself a Unique Vision",
  "I Thought to myself: These are some strange Birds!",
];

const player = new Tone.Player({
  url: "assets/sounds/birds.mp3", // Replace with the path to your MP3 file
  autostart: false,
}).toDestination();

startBtn.addEventListener("click", () => {
  startAudioContext();
});

//create lowpass filter
const lowPassFilter = new Tone.Filter(20000, "lowpass").toDestination(); // High frequency by default (not affecting sound)
player.connect(lowPassFilter);

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
  const minFrequency = 20; // Minimum human-audible frequency
  // Clamp the amount between 0 and 100 to avoid invalid values
  amount = Math.max(0, Math.min(amount, 100));

  // Calculate the frequency value, ensuring it stays within valid range
  const frequency = minFrequency + (maxFrequency - minFrequency) * (1 - amount / 100);

  // Ensure the frequency stays within the acceptable range for the filter
  lowPassFilter.frequency.value = Math.max(minFrequency, Math.min(frequency, maxFrequency));
}


scrollableSquare.addEventListener("scroll", () => {
  const scrollTop = scrollableSquare.scrollTop;
  const scrollHeight =
    scrollableSquare.scrollHeight - scrollableSquare.clientHeight;

  const startColor = { r: 71, g: 89, b: 115 }; // Grayish blue
  const endColor = { r: 135, g: 206, b: 250 }; // Sky blue

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
  } else if (scrollPercentage <= 0.5) {
    newTextIndex = 2;
  } else if (scrollPercentage <= 0.75) {
    newTextIndex = 3;
  } else {
    newTextIndex = 4;
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

  //adjust the volume based on scroll percentage
  setVolume(0.001 + scrollPercentage * 0.9);
  setLowPassFilter(scrollPercentage * 100);
});
