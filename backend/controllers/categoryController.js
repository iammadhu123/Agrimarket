const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const { active } = req.query;
  const query = active === 'true' ? { isActive: true } : {};
  const categories = await Category.find(query).sort('name');
  res.json({ success: true, categories });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.path : '';

  const category = await Category.create({ name, description, image });
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;
  if (req.file) category.image = req.file.path;

  await category.save();
  res.json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
