const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

app.use(morgan('dev'));
app.use(cors());
