const scrollableSquare = document.getElementById('main-content');
const body = document.getElementById('body');

scrollableSquare.addEventListener('scroll', () => {
    const scrollTop = scrollableSquare.scrollTop;
    const scrollHeight = scrollableSquare.scrollHeight - scrollableSquare.clientHeight;


    const startColor = { r: 71, g: 89, b: 115 }; // Grayish blue
    const endColor = { r: 135, g: 206, b: 250 }; // Sky blue

    const scrollPercentage = scrollTop / scrollHeight;

     // Map the scroll percentage (0 to 1) to the range 20 to 80
     const bgBackgroundPercentage = Math.round(40 + (scrollPercentage * (80 - 40))); 

    const newColor = {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * scrollPercentage),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * scrollPercentage),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * scrollPercentage),
    };

    body.style.background = `radial-gradient(circle, rgba(126,126,126,1) 3%, rgba(0,0,0,1) ${bgBackgroundPercentage}%)`;

    scrollableSquare.style.backgroundColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;

});