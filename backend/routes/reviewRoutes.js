const express = require('express');
const router = express.Router();
const { addReview, updateReview, deleteReview, getProductReviews, getMyReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.get('/my-reviews', protect, authorize('buyer'), getMyReviews);
router.post('/', protect, authorize('buyer'), addReview);
router.put('/:id', protect, authorize('buyer'), updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
