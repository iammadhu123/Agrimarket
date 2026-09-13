const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getFarmerOrders, getOrder,
  updateOrderStatus, cancelOrder, getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('buyer'), placeOrder);
router.get('/my-orders', protect, authorize('buyer'), getMyOrders);
router.get('/farmer-orders', protect, authorize('farmer'), getFarmerOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('farmer', 'admin'), updateOrderStatus);
router.put('/:id/cancel', protect, authorize('buyer'), cancelOrder);

module.exports = router;
