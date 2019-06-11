const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;
const connectDB = require('./config/db');

// Connect database
connectDB();

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})