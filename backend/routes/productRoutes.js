const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getMyProducts, removeProductImage,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public
router.get('/', getProducts);
router.get('/my-products', protect, authorize('farmer'), getMyProducts);
router.get('/:id', getProducts); // Reuse but single
router.get('/:id', getProduct);

// Farmer
router.post('/', protect, authorize('farmer'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('farmer', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);
router.delete('/:id/image/:imageId', protect, authorize('farmer', 'admin'), removeProductImage);

module.exports = router;
