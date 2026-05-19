const express = require('express');
const cors = require('cors');
const submitIdea = require('./api/submit-idea');
const submitContact = require('./api/submit-contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/submit-idea', async (req, res) => {
  await submitIdea(req, res);
});

app.post('/api/submit-contact', async (req, res) => {
  await submitContact(req, res);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
