const https = require('https');

// Replace with your Render URL after deployment
const RENDER_URL = 'https://your-render-url.onrender.com';

function pingServer() {
  https.get(RENDER_URL, (resp) => {
    console.log('Server pinged successfully:', new Date().toISOString());
  }).on('error', (err) => {
    console.error('Error pinging server:', err.message);
  });
}

// Ping every 14 minutes (Render has a 15-minute timeout)
setInterval(pingServer, 14 * 60 * 1000);

// Initial ping
pingServer(); 