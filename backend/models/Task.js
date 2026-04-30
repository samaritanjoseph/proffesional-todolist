const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending', index: true },
  dueDate: { type: Date, required: true, index: true },
  notified: { type: Boolean, default: false, index: true }, // Prevents spamming overdue notifications
  reminderSent: { type: Boolean, default: false, index: true } // Prevents spamming upcoming reminders
}, { timestamps: true });

// Compound indexes to optimize cron job queries
taskSchema.index({ dueDate: 1, status: 1, notified: 1 });
taskSchema.index({ dueDate: 1, status: 1, reminderSent: 1 });

module.exports = mongoose.model('Task', taskSchema);