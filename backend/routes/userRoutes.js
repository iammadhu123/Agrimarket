const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, getAllUsers, getUserById, toggleUserStatus, deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
