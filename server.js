const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect database
connectDB();

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});