const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const restaurantRouter = require('./routes/restaurant.router');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/restaurent';

mongoose
  .connect(uri)
  .then(() => {
    console.log('connection to database is successful');
  })
  .catch((err) => {
    console.log('unable to connect to database');
    console.log('ERROR:', err);
  });
app.get('/', (req, res) => {
  res.send('hello,from the server');
});
app.use('/api', restaurantRouter);

app.listen(port, () => console.log(`app listening on port ${port}!`));
