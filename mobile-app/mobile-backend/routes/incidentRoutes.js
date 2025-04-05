const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/report-incident
router.post('/report-incident', upload.array('mediaFiles', 10), (req, res) => {
  try {
    const { title, description, severity, latitude, longitude } = req.body;
    const files = req.files;

    if (!title || !description || !severity || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('📩 Incident Received:');
    console.log({
      title,
      description,
      severity,
      location: { lat: latitude, lng: longitude },
      files
    });

    // Optional DB save logic here...

    res.status(200).json({ message: 'Incident reported successfully!' });
  } catch (err) {
    console.error('❌ Error handling report:', err);
    res.status(500).json({ message: 'Server error while reporting incident' });
  }
});

module.exports = router;
