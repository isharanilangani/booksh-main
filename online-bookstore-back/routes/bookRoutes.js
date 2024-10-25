const express = require('express');
const { addBook, getBooks } = require('../controllers/bookController');
const router = express.Router();

router.post('/book', addBook);
router.get('/books', getBooks);

module.exports = router;
