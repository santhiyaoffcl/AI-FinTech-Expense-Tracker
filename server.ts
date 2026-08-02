import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './server/config/db.js';
import { ensureDemoUser } from './server/controllers/authController.js';
import authRoutes from './server/routes/authRoutes.js';
import expenseRoutes from './server/routes/expenseRoutes.js';
import incomeRoutes from './server/routes/incomeRoutes.js';
import budgetRoutes from './server/routes/budgetRoutes.js';
import aiRoutes from './server/routes/aiRoutes.js';
import { errorHandler } from './server/middleware/errorMiddleware.js';

async function startServer() {
  // Initialize persistent database store (local JSON + MongoDB Atlas when configured)
  await initDB();
  await ensureDemoUser();

  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  const startListening = (port: number) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${port}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = port + 1;
        if (nextPort - PORT > 20) {
          console.error(`No available ports found from ${PORT} to ${nextPort - 1}`);
          process.exit(1);
        }
        console.warn(`Port ${port} is busy, retrying on ${nextPort}`);
        startListening(nextPort);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
  };

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/incomes', incomeRoutes);
  app.use('/api/budget', budgetRoutes);
  app.use('/api/ai', aiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  startListening(PORT);
}

startServer().catch((err) => {
  console.error('Fatal Server Initialization Error:', err);
});
