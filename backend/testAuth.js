require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function testAuth() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ email: 'admin@nexus.com' });
  if (!admin) {
    console.log('Admin not found in DB');
    process.exit();
  }
  
  console.log('Stored Password Hash:', admin.password);
  
  const isMatch = await bcrypt.compare('password123', admin.password);
  console.log('bcrypt compare password123:', isMatch);
  
  process.exit();
}

testAuth();
