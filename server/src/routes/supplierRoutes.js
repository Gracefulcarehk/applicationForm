const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Supplier = require('../models/Supplier');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new supplier
router.post('/', async (req, res) => {
  console.log('Received supplier data:', JSON.stringify(req.body, null, 2));
  const supplier = new Supplier(req.body);
  try {
    const newSupplier = await supplier.save();
    console.log('Supplier saved successfully:', JSON.stringify(newSupplier, null, 2));
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error saving supplier:', error);
    res.status(400).json({ message: error.message });
  }
});

// Upload documents for a supplier
router.post('/:id/documents', upload.array('documents'), async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const newDocuments = req.files.map(file => ({
      type: req.body.type || 'Other',
      fileUrl: `/uploads/${file.filename}`,
      uploadDate: new Date()
    }));

    supplier.documents.push(...newDocuments);
    await supplier.save();
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a supplier
router.patch('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    Object.keys(req.body).forEach(key => {
      supplier[key] = req.body[key];
    });

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    await supplier.remove();
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 