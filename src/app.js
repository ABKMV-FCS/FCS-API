const express = require('express');
const bodyParser = require('body-parser');
const { query, connect } = require('./db');
const cors = require('cors');
const morgan = require('morgan');
const app = express();



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

connect(function (err) {
	console.log(`connected to SQL Server`);
	require('./app_init');
});

app.use('/api',require('./api'))


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));