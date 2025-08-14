import bookModel from "../models/books.models.js";
import BurrowingModel from "../models/burrowinghistory.models.js";



// Get all burrowing history
export const getAllBurrowings = async (req, res) => {
  try {
    const burrowings = await BurrowingModel.find({status: "burrowed"})
      .populate("user", "fullName email")
      .populate("book", "title author category")
      .lean();
    res.status(200).json(burrowings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch burrowing history", message: err.message });
  }
};

// Borrow a book
export const createBurrowing = async (req, res) => {
  try {
    const { user, book } = req.body;
   

    console.log('Received burrow request:', req.body);

    // Validate required fields
    if (!user || !book) {
      return res.status(400).json({ 
        message: "Missing required fields",
        details: {
          user: !user ? "User ID is required" : null,
          book: !book ? "Book ID is required" : null
        }
      });
    }

    // Check if book exists and is available
    const bookDoc = await bookModel.findById(book);
    if (!bookDoc) {
      return res.status(404).json({ message: "Book not found" });
    }

    console.log('Book found:', bookDoc);

    if (bookDoc.availableCopies <= 0) {
      return res.status(400).json({ message: "Book is not available for borrowing" });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await BurrowingModel.findOne({
      user,
      book,
      status: "burrowed"
    });

    if (existingBorrow) {
      return res.status(400).json({ message: "You have already borrowed this book" });
    }

    // Create new borrow record
    const burrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const newBurrow = new BurrowingModel({
      user,
      book,
      burrowDate: burrowDate || new Date(),
      dueDate:  new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: "burrowed"
    });

     // Update book's available copies
    await bookModel.findByIdAndUpdate(book, {
      $inc: { availableCopies: -1 }
    });

    // Save the borrow record
    await newBurrow.save();

   

    // Return success response with populated borrow record
    const populatedBorrow = await BurrowingModel.findById(newBurrow._id)
      .populate("user", "fullName email")
      .populate("book", "title author category");

    res.status(201).json({ 
      message: "Book borrowed successfully", 
      burrowRecord: populatedBorrow 
    });

  } catch (err) {
    console.error("Error in createBurrowing:", err);
    res.status(400).json({ error: "Failed to borrow book", message: err.message });
  }
};

// Mark return or return a burrowed books:
export const returnBook = async (req, res) => {
  try {
    const burrowId = req.params.id;

    //find the burrow record
    const burrowRecord = await BurrowingModel.findById(burrowId).populate("book", "title author availableCopies");

    if (!burrowRecord) return res.status(404).json({ message: "Burrowing record not found" });

    if(burrowRecord.status === 'returned') return res.status(400).json({message: "Book already returned"});

    //update the burrow record
    burrowRecord.returnDate = new Date();
    burrowRecord.status = "returned";
    await burrowRecord.save();

    // Increment book's availableCopies
    await bookModel.findByIdAndUpdate(burrowRecord.book._id, {
      $inc: { availableCopies: 1 }
    });

    
    res.status(200).json({ message: "Book returned successfully", burrowRecord });
  } catch (err) {
    res.status(400).json({ error: "Failed to return book", message: err.message });
  }
};

// Get burrowings by user ID
export const getBurrowingsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const burrowings = await BurrowingModel.find({ user: req.params.id })
      .populate("book", "title author category coverImage")
      .sort({burrowDate: -1})
      .lean();
     ; // Count number of borrowings
     // Ensure each record has status (borrowed / returned)
    const formatted = burrowings.map((b) => ({
      ...b,
      status: b.status || "burrowed", // default if missing
    }));
    res.status(200).json( formatted);
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
      status: "burrowed",
      dueDate: { $lt: now },
    });

    res.status(200).json({ overdueBooksCount: count });
  } catch (error) {
    console.error("Error fetching overdue books count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
