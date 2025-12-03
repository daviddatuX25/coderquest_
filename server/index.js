import express from 'express';
import cors from 'cors';
import playerRoutes from './routes/playerRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', playerRoutes);
app.use('/api', leaderboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 CoderQuest API running on http://127.0.0.1:${PORT}`);
  console.log(`📊 Leaderboard: GET http://127.0.0.1:${PORT}/api/leaderboard`);
  console.log(`👤 Create Player: POST http://127.0.0.1:${PORT}/api/players`);
  console.log(`💬 Server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
