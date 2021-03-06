const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Import Routes
const companiesRoute = require('./routes/companies');
const clientsRoute = require('./routes/clients');

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

// Cron Job
cron.schedule('*/1 * * * *', () => {
  console.log(new Date());
});

// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/companies', companiesRoute);
app.use('/api/clients', clientsRoute);

app.listen(3000, () => console.log('Server up and running'))