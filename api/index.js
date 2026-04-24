const express = require('express');
const submitIdea = require('./api/submit-idea');
const submitContact = require('./api/submit-contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.post('/api/submit-idea', async (req, res) => {
  // Mock req/res for the handler
  await submitIdea.default(req, res);
});

app.post('/api/submit-contact', async (req, res) => {
  // Mock req/res for the handler
  await submitContact.default(req, res);
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
