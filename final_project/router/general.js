const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
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

// Task 1 & Task 10: Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      const getBooks = new Promise((resolve, reject) => {
          resolve(books);
      });
      const allBooks = await getBooks;
      res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
      res.status(500).json({message: "Error fetching books"});
  }
});

// Task 2 & Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const getBookByIsbn = new Promise((resolve, reject) => {
          if (books[isbn]) {
              resolve(books[isbn]);
          } else {
              reject("Book not found");
          }
      });
      const bookData = await getBookByIsbn;
      res.status(200).send(JSON.stringify(bookData, null, 4));
  } catch (error) {
      res.status(404).json({message: error});
  }
});

// Task 3 & Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
      const author = req.params.author;
      const getBooksByAuthor = new Promise((resolve, reject) => {
          let booksByAuthor = [];
          let isbns = Object.keys(books);
          isbns.forEach((isbn) => {
              if (books[isbn].author === author) {
                  booksByAuthor.push({"isbn": isbn, ...books[isbn]});
              }
          });
          if (booksByAuthor.length > 0) {
              resolve(booksByAuthor);
          } else {
              reject("Author not found");
          }
      });
      const authorBooks = await getBooksByAuthor;
      res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } catch (error) {
      res.status(404).json({message: error});
  }
});

// Task 4 & Task 13: Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title;
      const getBooksByTitle = new Promise((resolve, reject) => {
          let booksByTitle = [];
          let isbns = Object.keys(books);
          isbns.forEach((isbn) => {
              if (books[isbn].title === title) {
                  booksByTitle.push({"isbn": isbn, ...books[isbn]});
              }
          });
          if (booksByTitle.length > 0) {
              resolve(booksByTitle);
          } else {
              reject("Title not found");
          }
      });
      const titleBooks = await getBooksByTitle;
      res.status(200).send(JSON.stringify(titleBooks, null, 4));
  } catch (error) {
      res.status(404).json({message: error});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;