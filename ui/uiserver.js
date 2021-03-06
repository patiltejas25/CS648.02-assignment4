const express = require('express');
require('dotenv').config();

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
const env = { UI_API_ENDPOINT };
const port = process.env.UI_SERVER_PORT || 8000;
const app = express();
app.use(express.static('public'));
app.get('/env.js', (req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});
app.listen(port, () => {
  // console.log('UI started on port 8000');
  console.log(`UI started on port ${port}`);
});
