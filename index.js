var express = require('express');
var path = require('path');

const app = express()
const port = 3000

var mysql      = require('mysql');
const DBConnection = require('./DBConnection.json');
var connection = mysql.createConnection(DBConnection);
 
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

app.get('/', (req, res) => res.send('Hello World!'))

app.get("/test", (req, res) => {
    let {idtest} = req.query; // this gets the parameter idtest from the url query as a string
    let query = `SELECT * FROM Earl.test WHERE idtest=${idtest};`;
    connection.query(query, function (error, results, fields) {
        if (error) //error from db query
            res.status(500).json(error);
        else //it worked
            res.json({"data": results}); // wrap array in object to be parsed by unity
    });
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//connection.end();
