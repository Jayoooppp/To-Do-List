// jshint esversion:6
const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js");
const ld = require('lodash');
console.log(date);

mongoose.connect("mongodb+srv://admin_oooppp:yourpass123@cluster0.hoqad94.mongodb.net/todolistDB");

const itemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]

})


const todo_items = mongoose.model("Item" , itemSchema);
const List = mongoose.model("List" , listSchema);





// work_items.insertMany([work1 , work2 , work3] , function (err) { 
//     if(err)
//     {
//         console.log(err);
//     }else{
//         console.log("Data is added in the database");
//     }
//  })



const item1 = new todo_items({
    item: "Prepare Food"
})


const item2 = new todo_items({
    item: "Eat Food"
})


const item3 = new todo_items({
    item: "work"
})


const app = express();
app.set('view engine' , 'ejs');


app.use(parser.urlencoded({extended: true}))

app.use(express.static("public"))



app.get("/" , function (req , res) { 

    todo_items.find(function (err , items) { 
        if(items.length === 0)
        {
            todo_items.insertMany([item1 , item2 , item3] , function(err){
                if(err)
                {
                    console.log(err);
                }else{
                    console.log("Items are added in the database")
                }
            })

            res.redirect("/");

        }else{
            res.render("list" , {title:date.getDate() , newitems: items});
        } 
     })
    
 })



app.post("/delete" , function (req , res) { 
    var id_remove = req.body.checkbox;
    var title_remove = req.body.hidden;

    if(title_remove === date.getDate())
    {
        todo_items.deleteOne({_id: id_remove} , function (err) { 
        if(err)
        {
            console.log(err);
        }else{
            res.redirect("/")
        }
     })

    }else{
        List.update({name: ld.capitalize(title_remove)} , {$pull: {"items": {_id:  id_remove}}} , function(err){
            if(err)
            {
                console.log(err);
            }else{
                console.log("Data Deleted")
                res.redirect("/" + title_remove)
                
            }
        })
            
    
    }
    
    
 })


app.post("/" , function (req , res) { 
    const itemn = new todo_items({
        item: req.body.item
    })
    if(req.body.button === date.getDate())
    {
        
        itemn.save();
        res.redirect("/")
        
    }else{
        var list_title = ld.capitalize(req.body.button);
        
        List.updateOne({name: list_title} , {$push: {items: itemn}} , function(err){
            if(err)
            {
                console.log(err)
            }else{
                console.log("New item is added in the list")
                res.redirect("/" + list_title)

                
            }
        })
        
    }

 })
const  defaultItems = [item1, item2 , item3];


app.get("/:title" , function (req , res) { 
    var new_title = ld.capitalize(req.params.title);
    List.findOne({name: new_title} ,  function(err , result){
        if(!err)
        {
            if(!result)
            {
                const new_list = List({
                            name: new_title,
                            items: defaultItems
                        })
                        new_list.save();
                  res.redirect("/" + new_title);
            }
            else
            {
            res.render("list" , {title:result.name , newitems: result.items})
            }
        }else{
            console.log(err)
        }
        
    })


 })


app.get("/about" , function (req  , res) { 
    res.render("about")
 })



app.listen(process.env.PORT ||3000 , function () { 
    console.log("Server started");
 })