import express from 'express';
import { sendRestockEmail } from '../utils/email.js';
import Shoe from '../modeles/shoe.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST route to handle restock requests with PDF attachment
router.post('/request', upload.single('pdf'), async (req, res) => {
  console.log('Received restock request:', req.body, req.file);
  const { shoeId, color, size, supplierEmail } = req.body;
  const pdfFile = req.file;

  // Enhanced validation
  if (!shoeId || !color || !size || !supplierEmail || !pdfFile) {
    console.log('Missing required fields:', { shoeId, color, size, supplierEmail, pdfFile });
    return res.status(400).json({
      message: 'Missing required fields: shoeId, color, size, supplierEmail, and pdf are required',
    });
  }

  try {
    // Verify the shoe exists and get its details
    const shoe = await Shoe.findById(shoeId);
    if (!shoe) {
      console.log('Shoe not found with ID:', shoeId);
      return res.status(404).json({ message: 'Shoe not found' });
    }

    // Find the specific variant and size
    const variant = shoe.variants.find((v) => v.color === color);
    if (!variant) {
      console.log('Color not found:', color, 'for shoe:', shoeId);
      return res.status(404).json({ message: `Color ${color} not found for this shoe` });
    }

    const sizeEntry = variant.sizes.find((s) => s.size === parseInt(size));
    if (!sizeEntry) {
      console.log('Size not found:', size, 'for color:', color);
      return res.status(404).json({ message: `Size ${size} not found for color ${color}` });
    }

    const stock = sizeEntry.stock;

    // Send email with PDF attachment
    await sendRestockEmail({
      brand: shoe.brand,
      model: shoe.model,
      color,
      size,
      stock,
      supplierEmail,
      pdfBuffer: pdfFile.buffer,
      pdfFilename: pdfFile.originalname,
    });

    res.status(200).json({
      message: `Restock request sent for ${shoe.brand} ${shoe.model} (${color}, Size ${size})`,
    });
  } catch (error) {
    console.error('Error processing restock request:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Failed to process restock request',
      error: error.message,
    });
  }
});

export default router;