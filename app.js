// jshint esversion:6
const express = require("express");
const parser = require("body-parser");
const date = require(__dirname + "/date.js");
console.log(date);

const app = express();
app.set('view engine' , 'ejs');


app.use(parser.urlencoded({extended: true}))

app.use(express.static("public"))


const work_items = ["Excel" , "Meeting"];


const list_items = ["Buy Food" , "Cook Food" , "Eat Food"];

app.get("/" , function (req , res) { 
    
    res.render("list" , {title:date.getDay() , newitems:list_items} );
 })



app.post("/" , function (req , res) { 
    if(req.body.button === "Work")
    {
        work_items.push(req.body.item);
        res.redirect("/work");
    }else{
        list_items.push(req.body.item);
        res.redirect("/")
    }

 })

app.get("/work" , function (req , res) { 
    res.render("list" , {title: "Work" , newitems:work_items});
 })

app.post("/work" , function (req , res) { 
    work_items.push(req.body.item);
    res.redirect("/work")
 })

app.get("/about" , function (req  , res) { 
    res.render("about")
 })



app.listen(3000 , function () { 
    console.log("Server started");
 })