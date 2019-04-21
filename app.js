'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const conf = require('./conf');
const helmet = require('helmet');


const app = express();
const router = express.Router();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

mongoose.connect(conf.connectioString, { useNewUrlParser: true })



const index = require('./content/routes/index');


app.use(cors(corsOptions))
app.use(helmet());

app.use(bodyParser.json({
  limit: '50mb', extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '50mb', extended: true
}));

app.use('/', index);

module.exports = app;