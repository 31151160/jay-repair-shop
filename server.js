const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve all static front-end assets (HTML, images, scripts) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Render to monitor app status
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Jay Repair Shop API is running smoothly.' });
});

// Fallback route for single-page application navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});