const express = require('express');
const router = express.Router();
const { getDashboardStats, sendNotification, getReports } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getDashboardStats);
router.get('/reports', getReports);
router.post('/notify', sendNotification);

module.exports = router;
