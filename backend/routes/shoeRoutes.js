import express from 'express';
import * as shoeController from '../controllers/shoeController.js';

const router = express.Router();

// CRUD Routes
router.post('/', shoeController.addShoe);
router.get('/', shoeController.getAllShoes);
router.get('/:id', shoeController.getShoe);
router.put('/:id', shoeController.updateShoe);
router.delete('/:id', shoeController.deleteShoe);

// Search and Category Routes
router.get('/search', shoeController.searchShoes);
router.get('/category/:category', shoeController.getShoesByCategory);

export default router;