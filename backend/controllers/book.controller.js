import bookModel from "../models/books.models.js";

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.find().lean();
    res.status(200).json(books);
    console.log(books)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books", message: err.message });
  }
};
// Totalbooks:

export const countBooks = async(req, res)=>{
  try {
    const books = await bookModel.find();

    const totalBooks = await bookModel.countDocuments();
    res.status(200).json({totalBooks})
  } catch (error) {
    res.status(500).json({message: "Failed to count books", error})
  }
}

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book", message: err.message });
  }
};

// Add new book
export const createBook = async (req, res) => {
  try {
    const newBook = new bookModel(req.body);
    await newBook.save();
    res.status(201).json({ message: "Book created successfully", newBook });
  } catch (err) {
    res.status(400).json({ error: "Failed to create book", message: err.message });
  }
};

// Update book by ID
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await bookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated", updatedBook });
  } catch (err) {
    res.status(400).json({ error: "Failed to update book", message: err.message });
  }
};

// Delete book by ID
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await bookModel.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book", message: err.message });
  }
};

// book category with it's count

export const getBookCategoryCounts = async (req, res) => {
  try {
    const categoryCounts = await bookModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Convert array to object { category: count }
    const formattedCounts = {};
    categoryCounts.forEach((item) => {
      formattedCounts[item._id] = item.count;
    });

    res.status(200).json({ categoryCounts: formattedCounts });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
