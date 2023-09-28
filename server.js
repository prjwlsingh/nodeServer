// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// GitHub API endpoint to get the first 15 users
const githubApiUrl = 'https://api.github.com/users';

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Route to fetch the first 15 GitHub users
app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(`${githubApiUrl}?per_page=15`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const users = response.data;
    res.json(users);
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    res.status(500).json({ error: 'Unable to fetch GitHub users' });
  }
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
