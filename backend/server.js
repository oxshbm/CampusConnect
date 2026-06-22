require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const registerGroupChat = require('./socket/groupChat');
const registerProjectChat = require('./socket/projectChat');

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const clubRoutes = require('./routes/clubRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];

const validateEnvironment = () => {
  const missingEnv = requiredEnv.filter((name) => !process.env[name]);

  if (missingEnv.length > 0) {
    throw new Error(`Missing environment variables: ${missingEnv.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  if (process.env.JWT_SECRET === 'your_min_32_char_random_string_here_change_this_12345') {
    throw new Error('JWT_SECRET must be changed from the example value');
  }

  if (/PASSWORD|cluster0\.xxx|your[-_]/i.test(process.env.MONGODB_URI)) {
    throw new Error('MONGODB_URI still contains placeholder values');
  }
};

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins },
});
registerGroupChat(io);
registerProjectChat(io);
app.set('io', io);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CampusConnect API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/projects', projectRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();

    const server = httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error(`Server startup failed: ${error.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error(`Backend startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
