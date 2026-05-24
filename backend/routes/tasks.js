const router = require('express').Router();
const Task = require('../models/Task');
const verify = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const checkPremium = require('../middleware/checkPremium');
const { body, validationResult } = require('express-validator');

// GET TASKS (Admin/Manager: All, User: Only theirs)
router.get('/', verify, async (req, res, next) => {
  try {
    const query = (req.user.role === 'admin' || req.user.role === 'manager') ? {} : { assignedTo: req.user.id };
    const tasks = await Task.find(query).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET ANALYTICS (Admin only)
router.get('/analytics', verify, checkRole('admin'), async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          completed: { 
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } 
          },
          pending: { 
            $sum: { $cond: [{ $in: ["$status", ["pending", "in-progress"]] }, 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await Task.aggregate(pipeline);

    // Map MongoDB dayOfWeek (1=Sun, 2=Mon...7=Sat) to short day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // We want to return exactly 7 days ending today. Let's build a static array of the last 7 days.
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        name: dayNames[d.getDay()],
        dayOfWeek: d.getDay() + 1, // MongoDB equivalent
        completed: 0,
        pending: 0
      });
    }

    // Merge DB results into our 7-day array
    results.forEach(dbDay => {
      const target = last7Days.find(d => d.dayOfWeek === dbDay._id);
      if (target) {
        target.completed = dbDay.completed;
        target.pending = dbDay.pending;
      }
    });

    res.json(last7Days.map(d => ({ name: d.name, completed: d.completed, pending: d.pending })));
  } catch (err) {
    next(err);
  }
});

const User = require('../models/User');
const sendEmail = require('../utils/email');

// CREATE TASK (Admin or Premium)
router.post('/', verify, checkPremium, [
  body('title').notEmpty().withMessage('Title is required'),
  body('assignedTo').isMongoId().withMessage('Valid User ID is required'),
  body('dueDate').isISO8601().toDate().withMessage('Valid due date is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // If premium user (not admin or manager), they can only assign tasks to themselves
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.body.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Premium users can only assign tasks to themselves" });
    }

    const task = new Task(req.body);
    await task.save();

    // Trigger Real-time Notification
    const io = req.app.get('socketio');
    const activeUsers = req.app.get('activeUsers');
    const targetSocket = activeUsers.get(req.body.assignedTo.toString());
    
    if (targetSocket) {
      io.to(targetSocket).emit('notify', `New Task Assigned: ${task.title}`);
    }

    // Trigger Email Notification
    const targetUser = await User.findById(req.body.assignedTo);
    if (targetUser && targetUser.email) {
      await sendEmail(
        targetUser.email,
        `New Task Assigned: ${task.title}`,
        `Hello ${targetUser.name},\n\nYou have been assigned a new task: "${task.title}".\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}\n\nPlease log in to the dashboard to view the details.`
      );
    }

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// UPDATE TASK STATUS (Owner or Admin)
router.patch('/:id', verify, [
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Status must be pending, in-progress, or completed')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Security: Only the owner or an admin can update
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Use the status from request body, fall back to 'completed' for backward compatibility
    task.status = req.body.status || 'completed';
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// FULL UPDATE TASK (Admin only)
router.put('/:id', verify, checkRole('admin'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('assignedTo').optional().isMongoId().withMessage('Valid User ID is required'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Valid due date is required'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Status must be pending, in-progress, or completed')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE TASK (Admin only)
router.delete('/:id', verify, checkRole('admin'), async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router; // CRITICAL: This prevents the error you are seeing