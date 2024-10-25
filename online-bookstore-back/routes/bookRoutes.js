const express = require('express');
const { addBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const router = express.Router();

router.post('/book', addBook);
router.get('/books', getBooks);
router.put("/book/:id", updateBook); 
router.delete("/book/:id", deleteBook); 

module.exports = router;
