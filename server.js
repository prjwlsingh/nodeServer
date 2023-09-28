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
app.get('/search', async (req, res) => {
  const searchTerm = req.query.term; // Get the search term from the query parameter
  try {
    const response = await axios.get(`${githubApiUrl}?per_page=15`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const users = response.data;
    
    // Filter users whose names have the search term as a prefix or suffix
    const filteredUsers = users.filter(user => {
      const lowerCaseName = user.login.toLowerCase();
      const lowerCaseTerm = searchTerm.toLowerCase();
      return lowerCaseName.startsWith(lowerCaseTerm) || lowerCaseName.endsWith(lowerCaseTerm);
    });

    // Sort filtered users by followers (you can choose 'followers' or any other criteria)
    const sortedUsers = filteredUsers.sort((a, b) => b.followers - a.followers).slice(0, 15);

    res.json(sortedUsers);
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    res.status(500).json({ error: 'Unable to fetch GitHub users' });
  }
});
