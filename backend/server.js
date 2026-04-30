require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const { Server } = require('socket.io');
const initCron = require('./utils/cron'); // Import our cron helper

const path = require('path');
const fs = require('fs');

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images to be loaded cross-origin
}));

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", methods: ["GET", "POST"] } 
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Track online users for private notifications (UserId -> SocketId)
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is now active on socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let [uId, sId] of activeUsers.entries()) {
      if (sId === socket.id) {
        activeUsers.delete(uId);
        break;
      }
    }
    console.log('User disconnected');
  });
});

// Make socket objects accessible in our API routes
app.set('socketio', io);
app.set('activeUsers', activeUsers);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message, error: process.env.NODE_ENV === 'development' ? err : {} });
});

// Initialize Database and Services
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Start the Cron Job once the server is up
      initCron(io, activeUsers);
    });
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));