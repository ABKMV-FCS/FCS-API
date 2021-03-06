const express = require('express');
const bodyParser = require('body-parser');
const { query, connect } = require('./db');
const morgan = require('morgan');
const app = express();
// app.disable("x-powered-by");
const cors = require('cors');
app.use(cors());

app.use(express.static('public'));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

console.log(`connecting to SQL Server...`);
connect(function (err) {
	if(err){
		console.log(`Cannot connect to SQL Server`);
	}
	else{
			console.log('successfully connected to SQL server');
			require('./app_init');
	}
});

app.use('/api',require('./api'))

app.get('/test',(req,res)=>{
	res.send('hello')
})



app.get('*',(req,res)=>{
	let path=require('path')
	res.sendFile(path.resolve('public/index.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));