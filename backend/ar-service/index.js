// AR Service (Express/Three.js placeholder)

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// In-memory waste log storage
let wasteLogs = [];

app.get('/ar/blueprints', (req, res) => {
  res.json({
    status: 'ok',
    blueprints: [
      {
        name: 'Site A Main Building',
        url: 'https://example.com/blueprints/site-a-main.pdf',
        description: 'Main building blueprint for Site A',
        updated: '2025-11-01',
      },
      {
        name: 'Site B Warehouse',
        url: 'https://example.com/blueprints/site-b-warehouse.pdf',
        description: 'Warehouse blueprint for Site B',
        updated: '2025-10-28',
      },
      {
        name: 'Site C Parking Area',
        url: 'https://example.com/blueprints/site-c-parking.pdf',
        description: 'Parking area blueprint for Site C',
        updated: '2025-10-15',
      },
    ],
  });
});

// GET all waste logs
app.get('/ar/waste-logs', (req, res) => {
  res.json({ status: 'ok', logs: wasteLogs });
});

// POST a new waste log
app.post('/ar/waste-logs', (req, res) => {
  const log = req.body;
  log.timestamp = new Date().toISOString();
  // Ensure log has a unique id
  if (!log.id) {
    log.id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
  wasteLogs.push(log);
  res.json({ status: 'ok', log });
});

app.listen(4002, () => console.log('AR Service running on port 4002'));
