const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
      if (books[isbn].author === author) {
          booksByAuthor.push({"isbn": isbn, ...books[isbn]});
      }
  });
  if (booksByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
      res.status(404).json({message: "Author not found"});
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
      if (books[isbn].title === title) {
          booksByTitle.push({"isbn": isbn, ...books[isbn]});
      }
  });
  if (booksByTitle.length > 0) {
      res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
      res.status(404).json({message: "Title not found"});
  }
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      res.status(404).json({message: "Book not found"});
  }
});


// ----------------------------------------------------------------------
// Tasks 10-13: Promise Callbacks with Axios (For Grading)
// ----------------------------------------------------------------------

// Task 10: Get all books using Promise callbacks
public_users.get('/async-get-books', function (req, res) {
    axios.get('http://localhost:5000/')
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send(error));
});

// Task 11: Get book details by ISBN using Promise callbacks
public_users.get('/async-get-book/:isbn', function (req, res) {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send(error));
});

// Task 12: Get book details by Author using Promise callbacks
public_users.get('/async-get-author/:author', function (req, res) {
    axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send(error));
});

// Task 13: Get book details by Title using Promise callbacks
public_users.get('/async-get-title/:title', function (req, res) {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.send(response.data))
    .catch(error => res.status(500).send(error));
});

module.exports.general = public_users;