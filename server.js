const express = require('express');
const { nanoid } = require('nanoid');
const app = express();
const port = 9000;

app.use(express.json());

const books = [];

app.post('/books', (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
});

app.get('/books', (req, res) => {
  const bookList = books.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return res.status(200).json({
    status: 'success',
    data: {
      books: bookList,
    },
  });
});

app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const book = books.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});

app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(bookIndex, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
