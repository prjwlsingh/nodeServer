// lambda/users.js
const express = require('express');
const axios = require('axios');
const { json, send } = require('micro');
const { createExpressMiddleware } = require('netlify-cors-proxy');

const app = express();

// Enable CORS
app.use(createExpressMiddleware());

// GitHub API endpoint to get the first 15 users
const githubApiUrl = 'https://api.github.com/users';

// Route to fetch the first 15 GitHub users
app.get('/.netlify/functions/users', async (req, res) => {
  try {
    const response = await axios.get(`${githubApiUrl}?per_page=15`, {
      headers: {
        Authorization: `token YOUR_GITHUB_TOKEN_HERE`,
      },
    });

    const users = response.data;
    send(res, 200, users);
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    send(res, 500, { error: 'Unable to fetch GitHub users' });
  }
});

module.exports = app;
