const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if(req.body.username && req.body.password){
        username = req.body.username;
        password = req.body.password;

        if(isValid(username)){
            return res.status(409).json({message: "A user with this username already exists"});
        }
        
        users.push({username: username, password:password});
        return res.send(`Successfully created user ${username}`);
    }

    return res.status(400).json({message: "Username or pass weren't submitted"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn]));
 });

public_users.get('/author/:author', function (req, res){
    let authored_books_ids = Object.keys(books).filter((id)=>{
        return books[id].author === req.params.author;
    });
    let authored_books = {};
    for(i=0; i< authored_books_ids.length; i++){
        authored_books[authored_books_ids[i]] = books[authored_books_ids[i]];
    };
    return res.send(JSON.stringify(authored_books));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res){
    let titled_books_ids = Object.keys(books).filter((id)=>{
        return books[id].title === req.params.title;
    });
    let titled_books = {};
    for(i=0; i< titled_books_ids.length; i++){
        titled_books[titled_books_ids[i]] = books[titled_books_ids[i]];
    };
    return res.send(JSON.stringify(titled_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
