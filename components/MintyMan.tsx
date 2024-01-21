// components/MintyMan.tsx
import React, { useEffect } from 'react';
import Image from 'next/image';
import canvasImg from '../public/canvas.png';
//ts-ignore

const MintyMan: React.FC = () => {
    {/*
  useEffect(() => {
    // Load Pac-Man game script
    const script = document.createElement('script');
    script.src = `
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
    `
    script.async = true;

    script.onload = () => {
        // Initialize the game
        // @ts-ignore
        window.pacmanGame();
      
    };

    script.onerror = () => {
      // Handle script loading error here
      console.error(`Error loading ${script.src}`);
    };

document.body.appendChild(script); 
return () => {
      // Cleanup when the component unmounts
      document.body.removeChild(script);
    };
  }, []);
  console.log(MintyMan);

*/}
    
  return (
    
    <>
      <div style={{ fontFamily: 'ArcadeR', fontSize: '25px', textAlign: 'center' }}>
        {/* Display a loading message or game instructions here */}
      </div>
      {/*   <canvas id="canvas" style={{border: '5px solid white', width: '100%', height: '100%'}}>
     
        <div id="canvas-warning">Your browser does not support HTML Canvas. Please upgrade!</div>
      </canvas> */}

    <div id="" style={{border: '5px solid black', width: '100%', height: '100%'}}>
     
     <Image src={canvasImg} alt="canvas" />
   </div>

    </>
  );
};

export default MintyMan;
