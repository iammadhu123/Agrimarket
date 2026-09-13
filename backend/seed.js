const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const MarketPrice = require('./models/MarketPrice');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const categories = [
  { name: 'Vegetables', description: 'Fresh farm vegetables', image: '' },
  { name: 'Fruits', description: 'Fresh seasonal fruits', image: '' },
  { name: 'Grains', description: 'Wheat, rice, and other grains', image: '' },
  { name: 'Pulses', description: 'Dal, lentils, and legumes', image: '' },
  { name: 'Spices', description: 'Aromatic spices and herbs', image: '' },
  { name: 'Seeds', description: 'Quality seeds for farming', image: '' },
  { name: 'Organic Products', description: 'Certified organic produce', image: '' },
  { name: 'Dairy Products', description: 'Milk, butter, and dairy items', image: '' },
  { name: 'Other', description: 'Other agricultural products', image: '' },
];

const seedDB = async () => {
  await connectDB();

  if (process.argv[2] === '--destroy') {
    console.log('Destroying data...');
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Category.deleteMany({});
    await Product.deleteMany({});
    await MarketPrice.deleteMany({});
    console.log('Data destroyed!');
    process.exit(0);
  }

  console.log('Seeding database...');

  // Admin
  const adminExists = await User.findOne({ email: 'admin@agrimarket.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@agrimarket.com',
      password: 'Admin@123',
      role: 'admin',
      isActive: true,
    });
    console.log('Admin created: admin@agrimarket.com / Admin@123');
  }

  // Farmers
  const farmer1 = await User.create({
    name: 'Ramesh Kumar',
    email: 'ramesh@farmer.com',
    password: 'Farmer@123',
    role: 'farmer',
    phone: '9876543210',
    farmName: 'Kumar Green Farms',
    farmLocation: 'Punjab, India',
    bio: 'Organic farmer with 15 years of experience.',
  });

  const farmer2 = await User.create({
    name: 'Sunita Devi',
    email: 'sunita@farmer.com',
    password: 'Farmer@123',
    role: 'farmer',
    phone: '9876543211',
    farmName: 'Devi Organic Farm',
    farmLocation: 'Maharashtra, India',
    bio: 'Specializing in organic vegetables and fruits.',
  });

  // Buyers
  await User.create([
    {
      name: 'Priya Sharma',
      email: 'priya@buyer.com',
      password: 'Buyer@123',
      role: 'buyer',
      phone: '9876543212',
    },
    {
      name: 'Amit Singh',
      email: 'amit@buyer.com',
      password: 'Buyer@123',
      role: 'buyer',
      phone: '9876543213',
    },
  ]);

  console.log('Demo users created');

  // Categories
  const cats = await Category.insertMany(categories);
  console.log('Categories seeded');

  const vegCat = cats.find((c) => c.name === 'Vegetables');
  const fruitCat = cats.find((c) => c.name === 'Fruits');
  const grainCat = cats.find((c) => c.name === 'Grains');
  const spiceCat = cats.find((c) => c.name === 'Spices');
  const organicCat = cats.find((c) => c.name === 'Organic Products');

  // Products
  await Product.insertMany([
    {
      name: 'Fresh Tomatoes',
      description: 'Freshly harvested red tomatoes from our organic farm. Perfect for cooking and salads.',
      price: 40,
      quantity: 500,
      unit: 'kg',
      category: vegCat._id,
      farmer: farmer1._id,
      images: [{ url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', public_id: 'tomato' }],
      location: 'Punjab, India',
      isOrganic: true,
      status: 'active',
    },
    {
      name: 'Alphonso Mangoes',
      description: 'Premium Alphonso mangoes from Ratnagiri. Sweet, aromatic, and rich in nutrients.',
      price: 250,
      quantity: 200,
      unit: 'kg',
      category: fruitCat._id,
      farmer: farmer2._id,
      images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', public_id: 'mango' }],
      location: 'Maharashtra, India',
      isOrganic: false,
      status: 'active',
    },
    {
      name: 'Basmati Rice',
      description: 'Long grain aromatic Basmati rice. Perfect for biryani and pulao.',
      price: 120,
      quantity: 1000,
      unit: 'kg',
      category: grainCat._id,
      farmer: farmer1._id,
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', public_id: 'rice' }],
      location: 'Punjab, India',
      isOrganic: false,
      status: 'active',
    },
    {
      name: 'Red Chilli Powder',
      description: 'Pure ground red chilli powder. Adds the perfect heat to your dishes.',
      price: 180,
      quantity: 100,
      unit: 'kg',
      category: spiceCat._id,
      farmer: farmer2._id,
      images: [{ url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400', public_id: 'chilli' }],
      location: 'Maharashtra, India',
      isOrganic: false,
      status: 'active',
    },
    {
      name: 'Organic Spinach',
      description: 'Fresh organic spinach. Rich in iron and vitamins. Certified organic.',
      price: 30,
      quantity: 300,
      unit: 'kg',
      category: organicCat._id,
      farmer: farmer1._id,
      images: [{ url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', public_id: 'spinach' }],
      location: 'Punjab, India',
      isOrganic: true,
      status: 'active',
    },
    {
      name: 'Fresh Onions',
      description: 'High quality red onions. Perfect for everyday cooking.',
      price: 25,
      quantity: 800,
      unit: 'kg',
      category: vegCat._id,
      farmer: farmer2._id,
      images: [{ url: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400', public_id: 'onion' }],
      location: 'Maharashtra, India',
      isOrganic: false,
      status: 'active',
    },
  ]);

  console.log('Products seeded');

  // Market prices
  await MarketPrice.insertMany([
    { cropName: 'Tomato', marketName: 'Azadpur Mandi', location: 'Delhi', minPrice: 20, maxPrice: 60, avgPrice: 40, unit: 'kg', date: new Date() },
    { cropName: 'Onion', marketName: 'Lasalgaon Market', location: 'Maharashtra', minPrice: 15, maxPrice: 35, avgPrice: 25, unit: 'kg', date: new Date() },
    { cropName: 'Potato', marketName: 'Agra Mandi', location: 'Uttar Pradesh', minPrice: 10, maxPrice: 20, avgPrice: 15, unit: 'kg', date: new Date() },
    { cropName: 'Wheat', marketName: 'Ludhiana Market', location: 'Punjab', minPrice: 20, maxPrice: 25, avgPrice: 22, unit: 'kg', date: new Date() },
    { cropName: 'Rice (Basmati)', marketName: 'Karnal Market', location: 'Haryana', minPrice: 90, maxPrice: 150, avgPrice: 120, unit: 'kg', date: new Date() },
    { cropName: 'Mango (Alphonso)', marketName: 'Ratnagiri Market', location: 'Maharashtra', minPrice: 200, maxPrice: 350, avgPrice: 250, unit: 'kg', date: new Date() },
  ]);

  console.log('Market prices seeded');
  console.log('\n✅ Seeding complete!');
  console.log('\nDemo Accounts:');
  console.log('Admin  : admin@agrimarket.com / Admin@123');
  console.log('Farmer : ramesh@farmer.com   / Farmer@123');
  console.log('Farmer : sunita@farmer.com   / Farmer@123');
  console.log('Buyer  : priya@buyer.com     / Buyer@123');
  console.log('Buyer  : amit@buyer.com      / Buyer@123');

  process.exit(0);
};

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
