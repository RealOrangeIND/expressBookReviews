const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let usersRegister = [];
const axios = require('axios');

const doesExist = (username)=>{
    let userswithsamename = usersRegister.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      usersRegister.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred!"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getList = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books)));
    });
    
    getList.then(() => console.log("success"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const getBook = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
    });
    
    getBook.then(() => console.log("success")); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getBookAuthor = new Promise((resolve, reject) => {
        const author = req.params.author;
        for (i = 1; i < 11; i++) {
            if (books[i]["author"] == author) {
                resolve(res.send(books[i]))
            }
        };
    });
    
    getBookAuthor.then(() => console.log("success"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const getBookTitle = new Promise((resolve, reject) => {
        
        const title = req.params.title;
        for (i = 1; i < 11; i++) {
            if (books[i]["title"] == title) {
                resolve(res.send(books[i]))
            }
        };
    }); 
    
    getBookTitle.then(() => console.log("success"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
module.exports.usersRegister = usersRegister;
