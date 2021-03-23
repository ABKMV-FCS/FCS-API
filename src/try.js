// var mysql      = require('mysql');
// var config=require('../config.json')
// var connection = mysql.createConnection(config.sqlConnectionDetails);

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// connection.end();

let db=require('./db')
db.connect(function (a,b) {
	console.log(`connected to SQL Server`);
})