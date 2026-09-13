const express = require('express');
const router = express.Router();
const { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, submitComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/', protect, authorize('admin'), getAllComplaints);
router.put('/:id/status', protect, authorize('admin'), updateComplaintStatus);

module.exports = router;
