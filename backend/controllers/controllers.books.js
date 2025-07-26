const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  isbn: { type: String, required: true },
  publisher: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  coverImage: { type: String, required: true }, // URL publicly available
  availableCopies: { type: Number, required: true, default: 1 },
  totalCopies: { type: Number, required: true, default: 1 }
});

module.exports = mongoose.model('Book', bookSchema);