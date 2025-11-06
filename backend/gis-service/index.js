// GIS Service (Node.js/Map APIs placeholder)
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(bodyParser.json());

// Simple map endpoint (backwards compatible)
app.get('/gis/map', (req, res) => {
  res.json({ status: 'ok', mapData: [] });
});

// Publish endpoint: other services (e.g., Next API) can POST new waste logs here
// and we will broadcast them to connected WebSocket clients.
app.post('/gis/publish', (req, res) => {
  const payload = req.body;
  const message = JSON.stringify({ type: 'waste', payload });
  // Broadcast to all connected WS clients
  try {
    wss && wss.clients && wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(message);
    });
  } catch (e) {
    console.error('Broadcast failed', e);
  }
  res.json({ status: 'ok' });
});

const server = http.createServer(app);

// WebSocket server for real-time GIS updates
const wss = new WebSocketServer({ server, path: '/gis/ws' });

wss.on('connection', (ws) => {
  console.log('GIS WS client connected');
  ws.send(JSON.stringify({ type: 'welcome', ts: Date.now() }));
  ws.on('message', (msg) => {
    // For now we don't accept client messages, but log them for debug
    try { console.log('GIS WS recv:', msg.toString()); } catch (e) {}
  });
  ws.on('close', () => console.log('GIS WS client disconnected'));
});

server.listen(4003, () => console.log('GIS Service running on port 4003'));
