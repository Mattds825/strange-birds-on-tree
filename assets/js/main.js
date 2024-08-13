const scrollableSquare = document.getElementById("main-content");
const body = document.getElementById("body");
const storyText = document.getElementById("story-text");
let currentTextIndex = -1; // Initialize with an invalid index

const textOptions = [
    "I had a Strange Dream",
    "There was a small window with a Tree",
    "Birds started appering on the tree and singing",
    "Each bird itself a Unique Vision",
    "These are some strange Birds!"
];

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
    } else if (scrollPercentage <= 0.25) {
        newTextIndex = 1;
    } else if (scrollPercentage <= 0.50) {
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
});
