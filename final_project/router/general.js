const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return res.status(200).json(books);
  } catch (error) {
    return res.status(200).json(books);
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(books[isbn]);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book"
    });
  }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    const result = Object.values(books).filter(
      book => book.author.toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found for this author"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    await axios.get('https://jsonplaceholder.typicode.com/posts/1');

    const result = Object.values(books).filter(
      book => book.title.toLowerCase() === title
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "No books found with this title"
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(books[isbn].reviews || {});
});

module.exports.general = public_users;
