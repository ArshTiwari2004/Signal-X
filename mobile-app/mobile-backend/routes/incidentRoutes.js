const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Incident = require('../models/Incident'); // Make sure this exists
// const verifyToken = require('../middleware/verifyToken'); // Add your auth middleware here

// Create uploads folder if it doesn't exist
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer storage config
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
router.post(
  '/report-incident',
  // verifyToken, // Optional, for associating user
  upload.array('mediaFiles', 10),
  async (req, res) => {
    try {
      const { title, description, severity, latitude, longitude } = req.body;
      const files = req.files || [];

      if (!title || !description || !severity || !latitude || !longitude) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const mediaPaths = files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype
      }));

      const incident = new Incident({
        title,
        description,
        severity,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        media: mediaPaths,
        reportedBy: req.user?.id // if you use verifyToken to extract user ID
      });

      await incident.save();

      res.status(201).json({ message: 'Incident reported successfully!', incident });
    } catch (err) {
      console.error('❌ Error saving incident:', err);
      res.status(500).json({ message: 'Server error while reporting incident' });
    }
  }
);

module.exports = router;
