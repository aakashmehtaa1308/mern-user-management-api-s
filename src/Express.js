const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compress = require('compression');
const helmet = require('helmet');

const userRoutes = require('./Routes/User');
const authRoutes = require('./Routes/Auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/api', userRoutes);
app.use('/auth',authRoutes);

app.use('/', (req, res, next) => {
  res.send(
    `<h1> Hello, From the MERN Backend. How are You ? Hoping for good<h1>`
  );
});

module.exports = app;
