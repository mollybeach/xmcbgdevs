 // Get a reference to the canvas element
    const canvas = document.getElementById('myCanvas');

    // Check if the browser supports HTML5 canvas
    if (canvas.getContext) {
        const context = canvas.getContext('2d');

        // Create a new image object
        const img = new Image();

        // Set the source (URL) of the image
        img.src = '@/public/canvas.png'; // Replace with the actual image path

        // Add an event listener to run the script when the image is loaded
        img.onload = () => {
            // Use the drawImage method to draw the image on the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    } else {
        // Canvas not supported
        console.error('Canvas is not supported in this browser.');
    }

export default pacman