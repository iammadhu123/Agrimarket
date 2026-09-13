const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('buyer'));
router.post('/initiate', initiatePayment);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;
