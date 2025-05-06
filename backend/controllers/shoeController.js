import Shoe from '../modeles/Shoe.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../Uploads'); // Assuming the controller is in a 'controllers' folder
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('Created uploads directory:', uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Initialize multer with storage settings
const upload = multer({ storage: storage });

// Initialize express router
const router = express.Router();

// Handle file upload for shoes
router.post('/upload', upload.single('shoeImage'), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'File uploaded successfully!',
      file: req.file
    });
  } else {
    res.status(400).json({
      message: 'No file uploaded!'
    });
  }
});

// Add new shoe
export const addShoe = [
  async (req, res) => {
    try {
      console.log('Received shoe data:', req.body);
      
      // Validate variants first
      if (!req.body.variants || !Array.isArray(req.body.variants) || req.body.variants.length === 0) {
        return res.status(400).json({ error: 'At least one variant is required' });
      }

      // Shoe data structure
      const shoeData = {
        brand: req.body.brand,
        model: req.body.model,
        shoeWearer: req.body.shoeWearer,
        shoeType: req.body.shoeType,
        price: Number(req.body.price),
        description: req.body.description || '',
        variants: [],
      };

      // Process variants
      req.body.variants.forEach((variant, variantIndex) => {
        // Validate variant image
        if (!variant.imageUrl) {
          throw new Error(`Variant ${variantIndex + 1}: Image URL is required`);
        }

        const newVariant = {
          color: variant.color,
          imageUrl: variant.imageUrl,
          sizes: variant.sizes.map(size => ({
            size: Number(size.size),
            stock: Number(size.stock)
          }))
        };

        shoeData.variants.push(newVariant);
      });

      console.log('Creating shoe with data:', shoeData);
      const shoe = new Shoe(shoeData);
      await shoe.save();
      
      res.status(201).json({
        message: 'Shoe created successfully',
        data: shoe
      });
    } catch (error) {
      console.error('Error creating shoe:', error);
      res.status(400).json({ error: error.message });
    }
  }
];

// View all shoes
export const getAllShoes = async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View single shoe
export const getShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit shoe
export const updateShoe = [
  async (req, res) => {
    try {
      const shoeId = req.params.id;
      console.log('Updating shoe with ID:', shoeId);
      console.log('Received updated data:', req.body);

      // Validate variants
      if (!req.body.variants || !Array.isArray(req.body.variants) || req.body.variants.length === 0) {
        return res.status(400).json({ error: 'At least one variant is required' });
      }

      // Construct the updated shoe data
      const updatedShoeData = {
        brand: req.body.brand,
        model: req.body.model,
        shoeWearer: req.body.shoeWearer,
        shoeType: req.body.shoeType,
        price: Number(req.body.price),
        description: req.body.description || '',
        variants: [],
      };

      // Process and validate variants
      req.body.variants.forEach((variant, index) => {
        if (!variant.imageUrl) {
          throw new Error(`Variant ${index + 1}: Image URL is required`);
        }

        const processedVariant = {
          color: variant.color,
          imageUrl: variant.imageUrl,
          sizes: variant.sizes.map(size => ({
            size: Number(size.size),
            stock: Number(size.stock),
          })),
        };

        updatedShoeData.variants.push(processedVariant);
      });

      // Update the shoe document in the database
      const updatedShoe = await Shoe.findByIdAndUpdate(shoeId, updatedShoeData, { new: true });

      if (!updatedShoe) {
        return res.status(404).json({ error: 'Shoe not found' });
      }

      res.status(200).json({
        message: 'Shoe updated successfully',
        data: updatedShoe
      });
    } catch (error) {
      console.error('Error updating shoe:', error);
      res.status(400).json({ error: error.message });
    }
  }
];

// Delete shoe
export const deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json({ message: 'Shoe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search shoes
export const searchShoes = async (req, res) => {
  try {
    const { query } = req.query;
    const shoes = await Shoe.find({
      $or: [
        { brand: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } },
        { shoeType: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter by category
export const getShoesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let filter = {};
    
    if (["Men", "Women", "Kids"].includes(category)) {
      filter.shoeWearer = category;
    } else {
      filter.brand = category;
    }
    
    const shoes = await Shoe.find(filter);
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the router for use in the main app
export { router };