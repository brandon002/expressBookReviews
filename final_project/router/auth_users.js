const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if(users.find(user=> user.username === username) !== undefined){
    return false;
  } 
  return true;
}

const authenticatedUser = (username,password)=>{ 
  let user = users.find(user=> user.username === username);
  if(user !== undefined){
    if(user.password === password){return true;}
  }
  return false;
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(authenticatedUser(username, password)){
    let jwt_token;
    try{
      jwt_token = jwt.sign(
        {
          username: username
        },
        "topseceretet",
        { expiresIn: "4h" }
      );
      req.session.authorization  = {jwt_token, username};
      console.log(req.session)
      return res.status(200).json({message: "Logged in successfully", token: jwt_token });
    } catch(err){
      throw new Error(err);
    }
  }
  return res.status(400).json({message: "Unable to login"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const isbn = req.params.isbn;
  let idx = Object.keys(books).find(item=>item === isbn);
  books[isbn].reviews.message = review;
  return res.status(200).json({message: "Success", data: books[isbn]});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let idx = Object.keys(books).find(item=>item === req.params.isbn);
  delete books[idx].reviews.message;
  return res.status(200).json({message: "Success", newReview: books[idx].reviews});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
