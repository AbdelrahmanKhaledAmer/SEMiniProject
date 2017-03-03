//These lines acquire the used modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var DB_URI = "mongodb://localhost:27017/mpdb";
var session = require('express-session');

var router = require('./app/routes');

var app = express();
//Sending a test message to see if server works
// app.use('/',function(req,res)
// {
//     res.send("Server is working!");
// })


app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:"ch8w7qgcudbc89bcewqwh09g7",resave:false,saveUninitialized:true}));
app.use(express.static(__dirname+ '/views'));

mongoose.connect(DB_URI);
app.use(router);

//Starts the server and has it listen to port 5000.
app.listen(5000, function()
{
    console.log("server is listening on port 5000");
})