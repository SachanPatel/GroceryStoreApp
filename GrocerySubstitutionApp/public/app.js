// public/app.js
window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('captured-image');
    const submitBtn = document.getElementById('submit-btn');
    const recipeResults = document.getElementById('recipe-results');
  
    // Start the camera using getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    } else {
      alert('getUserMedia not supported on your browser!');
    }
  
    // Capture an image when the "Capture Image" button is clicked
    captureBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Convert the captured image to a Base64 data URL
      const dataURL = canvas.toDataURL('image/png');
      capturedImage.src = dataURL;
    });
  
    // Submit the captured image along with user preferences and previous dishes
    submitBtn.addEventListener('click', async () => {
      const imageData = capturedImage.src;
      if (!imageData) {
        alert('Please capture an image first!');
        return;
      }
  
      // Get selected cuisine preferences
      const selectedCuisines = [];
      document.querySelectorAll('input[name="cuisines"]:checked').forEach(checkbox => {
        selectedCuisines.push(checkbox.value);
      });
  
      // Get previous dishes (split by commas)
      const previousDishes = document.getElementById('previous-dishes').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
  
      const data = {
        imageData,
        cuisines: selectedCuisines,
        previousDishes
      };
  
      try {
        const response = await fetch('/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        displayResults(result);
      } catch (error) {
        console.error('Error:', error);
        alert('Error processing image.');
      }
    });
  
    // Display the recipe suggestions returned by the backend
    function displayResults(result) {
      recipeResults.innerHTML = '';
      // Assume result.recipes is an array of recipe objects
      if (result.recipes && result.recipes.length > 0) {
        result.recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.className = 'recipe';
          recipeDiv.innerHTML = `<h3>${recipe.name}</h3><p>${recipe.description}</p>`;
          recipeResults.appendChild(recipeDiv);
        });
      } else {
        recipeResults.innerHTML = '<p>No recipe suggestions found.</p>';
      }
    }
  });
  