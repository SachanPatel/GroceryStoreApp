// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Now using ESM import

const app = express();
const port = 3000;

// Use middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image data
app.use(express.static('public')); // Serve static files from the public folder

// POST route to receive image, user preferences, and previous dishes.
app.post('/analyze', async (req, res) => {
  const { imageData, cuisines, previousDishes } = req.body;
  
  // Prepare the request payload for Gemini API.
  const geminiRequest = {
    image: imageData,
    cuisines: cuisines,
    previousDishes: previousDishes,
  };

  try {
    // Replace the URL and add authorization headers or API keys as needed.
    const response = await fetch('https://api.gemini.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify(geminiRequest)
    });
    const result = await response.json();

    // Return the result back to the front end.
    res.json(result);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

// Start the server.
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
