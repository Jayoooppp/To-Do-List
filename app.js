const express = require("express");
const parser = require("body-parser");

const app = express();
app.set('view engine' , 'ejs');

app.use(parser.urlencoded({extended: true}))

var today = new Date();
var day;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


app.get("/" , function (req , res) { 
    day = days[today.getDay()]
    res.render("list" , {whichday:day});
 })



app.listen(3000 , function () { 
    console.log("Server started");
 })