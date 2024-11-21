const https = require('https');
const fs = require('fs');
const next = require('next');

// Create Next.js app in development or production mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Load the SSL certificate and private key
  const options = {
    key: fs.readFileSync('./server.key'),  // Path to the private key
    cert: fs.readFileSync('./server.crt'), // Path to the certificate
  };

  // Create HTTPS server with Next.js handler
  https
    .createServer(options, (req, res) => {
      handle(req, res); // Let Next.js handle all requests
    })
    .listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on https://localhost:3000');
    });
});
