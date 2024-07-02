const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

// Get all data
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get data by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new data
router.post('/', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
  const newData = new Data({
    name: req.body.name,
    value: req.body.value
  });
  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update data
router.put('/:id', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, value: req.body.value },
      { new: true }
    );
    if (!updatedData) return res.status(404).json({ message: 'Data not found' });
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete data
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
  try {
    const deletedData = await Data.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Data not found' });
    res.json({ message: 'Data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk upload data
router.post('/bulk', authenticateJWT, authorizeRole(['admin']), upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await Data.insertMany(results);
        fs.unlinkSync(filePath);
        res.status(201).json({ message: 'Bulk data uploaded' });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
