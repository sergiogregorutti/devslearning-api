const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => {
  console.log('DB connected.')
})
.catch(err => console.log('DB connection error: ', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const courseRoutes = require('./routes/course');

// App Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(cors()); // Allows all origins
if (process.env.NODE_ENV == 'development') {
  app.use(cors({òrigin: `http://localhost:3000`}));
}

// Middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', courseRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`)
});
