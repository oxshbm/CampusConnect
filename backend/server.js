require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const seedHardcodedAdmin = require('./utils/seedHardcodedAdmin');
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
const forumRoutes = require('./routes/forumRoutes');

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
const getClientOrigin = (urlStr) => {
  if (!urlStr) return '';
  try {
    const formatted = urlStr.trim().startsWith('http') ? urlStr.trim() : `https://${urlStr.trim()}`;
    return new URL(formatted).origin;
  } catch (error) {
    return urlStr.trim().replace(/\/$/, '');
  }
};

const clientOrigin = getClientOrigin(process.env.CLIENT_URL);
const allowedOrigins = [
  clientOrigin,
  clientOrigin ? `${clientOrigin}/` : null,
  'http://localhost:5173',
  'http://localhost:5173/',
  'http://localhost:5174',
  'http://localhost:5174/',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const exactMatch = allowedOrigins.some(allowed => 
      origin.toLowerCase() === allowed.toLowerCase() || 
      origin.toLowerCase() === `${allowed.toLowerCase()}/`
    );

    const isVercelPreview = origin.toLowerCase().startsWith('https://campus-connect-') && 
                            origin.toLowerCase().endsWith('.vercel.app');

    if (exactMatch || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
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
app.use('/api/forum', forumRoutes);

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
    await seedHardcodedAdmin();

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
