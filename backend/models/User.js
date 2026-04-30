const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
  avatar: { type: String, default: '' }
});

// Middleware to hash password before saving
// NOTE: In Mongoose 6+, async pre-hooks must NOT call next().
// Mongoose resolves the hook automatically when the async function returns.
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);