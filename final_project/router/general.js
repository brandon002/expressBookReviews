const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(!username){
    return res.status(400).json({message: "Please provide valid username"});
  }
  if(isValid(username)){
    users.push({
      'username': username,
      'password': password
    })
  }
  return res.status(200).json({message: "User Registered Successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let booksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },1000)})
  let result = await booksPromise;
  return res.status(200).json({result});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let booksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },1000)})
  let idx = Object.keys(books).find(item=>item === req.params.isbn);
  let result = await booksPromise;

  return res.status(200).json(result[idx]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookByAuthor = [];
  Object.keys(books).forEach((key, index)=> {(books[key].author == req.params.author) && bookByAuthor.push(books[key])});
  return res.status(200).json({bookByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookByTitle = [];
  Object.keys(books).forEach((key, index)=> {(books[key].title == req.params.title) && bookByTitle.push(books[key])});
  return res.status(200).json({bookByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let idx = Object.keys(books).find(item=>item === req.params.isbn);
  return res.status(200).json(books[idx].reviews);
});

module.exports.general = public_users;
