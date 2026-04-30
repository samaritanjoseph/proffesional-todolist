const cron = require('node-cron');
const Task = require('../models/Task');
const sendEmail = require('./email');

// We pass io and activeUsers from server.js so the cron job can send messages
const initCron = (io, activeUsers) => {
  // Runs every hour ('0 * * * *')
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running periodic task checks...');
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // 1. Check for OVERDUE tasks
      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: 'pending',
        notified: false
      }).populate('assignedTo', 'name email');

      for (const task of overdueTasks) {
        const socketId = activeUsers.get(task.assignedTo._id.toString());
        
        // If the user is currently online, send a real-time alert
        if (socketId) {
          io.to(socketId).emit('notify', `Urgent: Your task "${task.title}" is overdue!`);
        }

        // Send Email
        if (task.assignedTo && task.assignedTo.email) {
          await sendEmail(
            task.assignedTo.email, 
            `Task Overdue: ${task.title}`,
            `Hello ${task.assignedTo.name},\n\nYour task "${task.title}" is now overdue. Please complete it as soon as possible.`
          );
        }

        // Mark as notified so we don't spam the user every hour
        task.notified = true;
        await task.save();
      }

      // 2. Check for tasks due in LESS THAN 24 HOURS (Upcoming reminders)
      const upcomingTasks = await Task.find({
        dueDate: { $gt: now, $lt: in24Hours },
        status: 'pending',
        reminderSent: false
      }).populate('assignedTo', 'name email');

      for (const task of upcomingTasks) {
        const socketId = activeUsers.get(task.assignedTo._id.toString());
        
        if (socketId) {
          io.to(socketId).emit('notify', `Reminder: Your task "${task.title}" is due soon!`);
        }

        if (task.assignedTo && task.assignedTo.email) {
          await sendEmail(
            task.assignedTo.email, 
            `Task Reminder: ${task.title} is due soon`,
            `Hello ${task.assignedTo.name},\n\nJust a reminder that your task "${task.title}" is due within 24 hours on ${task.dueDate.toLocaleString()}.\n\nBest regards,\nTask Manager`
          );
        }

        task.reminderSent = true;
        await task.save();
      }

    } catch (err) {
      console.error('Cron Job Error:', err);
    }
  });
};

module.exports = initCron;