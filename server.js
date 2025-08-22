#!/usr/bin/env node

const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();
const port = process.env.PORT || 3001;

// Support pour les routes SPA (Single Page Application)
app.use(history({
  verbose: false,
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    }
  ]
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'build')));

// Gestion des erreurs 404 pour les routes non trouvées
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on http://0.0.0.0:${port}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'build')}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: ${process.env.REACT_APP_API_BASE_URL || 'Not configured'}`);
});

// Gestion propre des signaux de fermeture
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully');
  process.exit(0);
});
