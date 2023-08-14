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

    let accessToken = jwt.sign({data: password}, 'access', {expiresIn:60*60});

    req.session.authorization = {accessToken, username};
    return res.status(200).json({message:`${username} has successfully been signed in`});  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(!books[req.params.isbn]){
        return res.status(404).json({message:`book of isbn ${req.params.isbn} does not exist please put in a valid isbn`})
    }
    if(!req.body.stars){
        return res.status(406).json({message:"Please rate the book with a number of stars between 0 and 5"})
    }
    let stars = Number(req.body.stars)
    if(isNaN(stars) || stars < 0 || stars > 5){
        return res.status(406).json({message:"stars must be a number between 0 and 5"})
    }
    let review ={stars:stars, comment:""};
    if(req.body.comment){
        review['comment'] = req.body.comment;       
    }
    books[req.params.isbn].reviews[req.session.authorization['username']] = review;

  return res.status(200).json({message: `successfully added ${req.session.authorization['username']}'s review to book ${books[req.params.isbn].title}`});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(!books[req.params.isbn]){
        return res.status(404).json({message:`book of isbn ${req.params.isbn} does not exist please put in a valid isbn`})
    }

    if (books[req.params.isbn].reviews[req.session.authorization['username']]){
        delete books[req.params.isbn].reviews[req.session.authorization['username']];
    }
    
    return res.status(200).json({message: `Successfully deleted ${req.session.authorization['username']}'s review of ${books[req.params.isbn].title}`})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
