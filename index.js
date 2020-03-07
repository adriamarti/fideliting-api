const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const companiesRoute = require('./routes/companies');
// const randomRoute = require('./routes/random');

// Add Express to App
const app = express();

// Get node ENV variables
dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('Connected to our Data Base'),
);

// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/companies', companiesRoute);
// app.use('/api/random', randomRoute);

app.listen(3000, () => console.log('Server up and running'))