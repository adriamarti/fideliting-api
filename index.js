const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import 

// Import Routes
const companyRoute = require('./routes/company');
const randomRoute = require('./routes/random');

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
app.use('/api/company', companyRoute);
app.use('/api/random', randomRoute);

app.listen(3000, () => console.log('Server up and running'))