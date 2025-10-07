// server.js - FINAL DEPLOYMENT VERSION

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Use the PORT environment variable provided by Render, or default to 8080 for local dev
const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

// CRITICAL: Initialize WebSocket server with noServer: true
const wss = new WebSocket.Server({ noServer: true });

app.use(express.static('public'));

// CRITICAL: Handle the WebSocket upgrade event manually
// This is what allows it to work behind Render's proxy
server.on('upgrade', (request, socket, head) => {
  console.log('Parsing upgrade request...'); // We want to see this in the logs!
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
    console.log('WebSocket upgrade successful!'); // And this!
  });
});


wss.on('connection', (ws) => {
  console.log('✅ Client connected.');

  ws.on('message', (message) => {
    console.log(`➡️ Received message: ${message}`);
    console.log('📢 Broadcasting message to all clients...');

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected.');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
