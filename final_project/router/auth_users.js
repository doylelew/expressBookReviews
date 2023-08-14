const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "Matt Damon", password:"GetMeOffMarsPlease"}];

const isValid = (username)=>{
    valid_user = users.filter((user)=>{
        return user.username === username;
    });

    if(valid_user.length > 0){
        return true;
    }

    return false;

}

const authenticatedUser = (username,password)=>{
    valid_user = users.filter((user)=>{
        return user.username === username && user.password === password;
    });

    if(valid_user.length > 0){
        return true;
    }

    return false;
}



//only registered users can login
regd_users.post("/login", (req,res) => {
    if (!req.body.username || !req.body.password){
        return res.status(400).json({message:"You need to submit a username and password"})
    }
    const username = req.body.username;
    const password = req.body.password;

    if(!authenticatedUser(username, password)){
        if(!isValid(username)){
            return res.status(408).json({message: `${username} is not a registered user`})
        }
        return res.status(208).json({message: "Incorrect password"})
    }


    return res.status(200).json({message:"something is happening"});  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
