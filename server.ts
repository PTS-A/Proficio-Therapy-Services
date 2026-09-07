import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Provider Credentialing & Payer Enrollment Management System',
      timestamp: new Date().toISOString(),
    });
  });

  const cwdDist = path.join(process.cwd(), 'dist');
  const localDist = typeof __dirname !== 'undefined' ? __dirname : cwdDist;
  const distPath = fs.existsSync(path.join(cwdDist, 'index.html'))
    ? cwdDist
    : fs.existsSync(path.join(localDist, 'index.html'))
    ? localDist
    : cwdDist;

  const isBundled = typeof __dirname !== 'undefined' && path.basename(__dirname) === 'dist';
  const isProduction = process.env.NODE_ENV === 'production' || isBundled;

  // Vite middleware for development / Static file serving for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
