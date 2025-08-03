import BurrowingModel from "../models/burrowing.models.js";

// Get all burrowing history
export const getAllBurrowings = async (req, res) => {
  try {
    const burrowings = await BurrowingModel.find()
      .populate("user", "fullName email")
      .populate("book", "title author")
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

// Mark return
export const markReturn = async (req, res) => {
  try {
    const burrow = await BurrowingModel.findById(req.params.id);
    if (!burrow) return res.status(404).json({ message: "Burrowing record not found" });

    burrow.returnDate = new Date();
    burrow.status = "returned";
    await burrow.save();

    res.status(200).json({ message: "Book returned successfully", burrow });
  } catch (err) {
    res.status(400).json({ error: "Failed to return book", message: err.message });
  }
};

// Get burrowings by user ID
export const getBurrowingsByUser = async (req, res) => {
  try {
    const burrowings = await BurrowingModel.find({ user: req.params.userId })
      .populate("book", "title author")
      .lean();
    res.status(200).json(burrowings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's burrowing history", message: err.message });
  }
};
