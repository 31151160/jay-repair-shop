const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Cloudinary with your details
cloudinary.config({
  cloud_name: 'f29tqilk',
  api_key: '621437131787792',
  api_secret: 'K-VMfO-XOTntvvntSZDYFtLKjng'
});

// Set up storage engine for Multer to send files to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jay-repair-shop',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

// Middleware to parse incoming data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve all static front-end assets (HTML, images, scripts) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Render to monitor app status
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Jay Repair Shop API is running smoothly.' });
});

// Handle form submission with image upload & WhatsApp trigger
app.post('/submit-repair', upload.single('repairImage'), (req, res) => {
  try {
    const { name, device, issue } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Permanent Cloudinary URL

    const whatsappMessage = `New Repair Request:%0A- Name: ${name}%0A- Device: ${device}%0A- Issue: ${issue}%0A- Image: ${imageUrl}`;
    const whatsappUrl = `https://wa.me/27780688691?text=${whatsappMessage}`;

    res.json({ success: true, whatsappUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Image upload failed' });
  }
});

// Fallback route for single-page application navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});
