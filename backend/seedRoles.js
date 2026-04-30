require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@nexus.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'System Admin',
        email: 'admin@nexus.com',
        password: 'password123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@nexus.com / password123');
    } else {
      console.log('Admin already exists');
    }

    // Create Manager
    const managerExists = await User.findOne({ email: 'manager@nexus.com' });
    if (!managerExists) {
      const manager = new User({
        name: 'Project Manager',
        email: 'manager@nexus.com',
        password: 'password123',
        role: 'manager'
      });
      await manager.save();
      console.log('Manager user created: manager@nexus.com / password123');
    } else {
      console.log('Manager already exists');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
