import bookModel from "../models/books.models.js";
import BurrowingModel from "../models/burrowinghistory.models.js";



// Get all burrowing history
export const getAllBurrowings = async (req, res) => {
  try {
    const burrowings = await BurrowingModel.find({status: "burrowed"})
      .populate("user", "fullName, email")
      .populate("book", "title, author, category")
      .lean();
    res.status(200).json(burrowings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch burrowing history", message: err.message });
  }
};

// Borrow a book
export const createBurrowing = async (req, res) => {
  try {
    const newBurrow = new BurrowingModel(req.body);
    await newBurrow.save();
    res.status(201).json({ message: "Book borrowed successfully", newBurrow });
  } catch (err) {
    res.status(400).json({ error: "Failed to borrow book", message: err.message });
  }
};

// Mark return or return a burrowed books:
export const returnBook = async (req, res) => {
  try {
    const burrowId = req.params.id;

    //find the burrow record
    const burrowRecord = await BurrowingModel.findById(burrowId).populate("book", "title", "author", "availableCopies");

    if (!burrowRecord) return res.status(404).json({ message: "Burrowing record not found" });

    if(burrowRecord.status === 'returned') return res.status(400).json({message: "Book already returned"});

    burrowRecord.returnDate = new Date();
    burrowRecord.status = "returned";
    await burrowRecord.save();

    // Increment book's availableCopies
    await bookModel.findByIdAndUpdate(burrowRecord.book._id, {
      $inc: { availableCopies: 1 }
    });

    const updatedBook = await bookModel.findById(
      burrowRecord.book._id,
      "title","availableCopies"
    );


    res.status(200).json({ message: "Book returned successfully", burrowRecord });
  } catch (err) {
    res.status(400).json({ error: "Failed to return book", message: err.message });
  }
};

// Get burrowings by user ID
export const getBurrowingsByUser = async (req, res) => {
  try {
    const burrowings = await BurrowingModel.find({ user: req.params.userId })
      .populate("book", "title, author")
      .sort({burrowDate: -1})
      .lean();
    res.status(200).json(burrowings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's burrowing history", message: err.message });
  }
};

// get the number of books which have been burrowed!

export const getBorrowedBooksCount = async (req, res) =>{
  try {
    const count = await BurrowingModel.countDocuments({status:"burrowed"});

    res.status(200).json({burrowedBooksCount: count});
  } catch (error) {
    console.error("Error fetching borrowed books count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// get the number of books which are overdued:

export const getOverdueBooksCount = async (req, res) => {
  try {
    const now = new Date();

    // Count documents where status is "borrowed" and dueDate < now
    const count = await BurrowingModel.countDocuments({
      status: "borrowed",
      dueDate: { $lt: now },
    });

    res.status(200).json({ overdueBooksCount: count });
  } catch (error) {
    console.error("Error fetching overdue books count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
