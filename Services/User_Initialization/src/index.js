const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const {mongoose} = require('./database');

const PORT = process.env.PORT || 4001;
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (req, res)=>{
    console.log(`Server on PORT ${PORT}`);
});