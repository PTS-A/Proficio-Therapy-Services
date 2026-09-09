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

  // Backend Access Control Gate: Demo Employee Data strictly restricted to admin@example.com
  app.get('/api/demo-employees', (req, res) => {
    const userEmail = (req.headers['x-user-email'] as string || req.query.email as string || '').trim().toLowerCase();

    // Enforce Requirement 9 & 10: Backend access rules reject any non-admin account
    if (userEmail !== 'admin@example.com') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access Denied: Demo employee records are strictly isolated and accessible only to admin@example.com.',
        authorizedUser: 'admin@example.com',
        requestedBy: userEmail || 'anonymous',
      });
    }

    res.json({
      status: 'authorized',
      message: 'Access granted to demo employee database partition for admin@example.com.',
      user: 'admin@example.com',
      collection: 'demo_employees',
    });
  });

  // Verify access permissions for data endpoints
  app.post('/api/demo-employees/verify', (req, res) => {
    const { email } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (cleanEmail !== 'admin@example.com') {
      return res.status(403).json({
        allowed: false,
        error: 'Only admin@example.com is permitted to access or modify demo employee records.',
      });
    }

    res.json({
      allowed: true,
      role: 'Administrator',
      email: 'admin@example.com',
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
