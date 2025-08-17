import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.models.js';


// User Registration Controller
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User with the provided email address already exists.",
      });
    }

    // Hash the password
    const hashedPw = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPw,
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Success response
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// User Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email address!" });
    }

    const isUserMatch = await bcrypt.compare(password, user.password);
    if (!isUserMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error("Error while login:", err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// Admin-only: Fetch all users count
export const getAllUsers = async (req, res) => {
  try {
    
    const count = await userModel.countDocuments().select("-password"); 
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// updateUser 
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, email, currentPassword, newPassword } = req.body;

     // Logged-in user from protect middleware
    const loggedInUser = req.user;

    // Validate required fields
    if (!fullName || !email ) {
      return res.status(400).json({ message: "Full name and email  are required." ,
        details:{
          fullName: !fullName ? "Fullname is required" : null,
          email : !email? "Email is required" : null
        }
      });
    }

    // Match schema validations
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!nameRegex.test(fullName)) {
      return res.status(400).json({ message: "Name should contain only letters and spaces." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check for email uniqueness
    if (email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use." });
      }
    }

     // Require current password for any profile update for user but admin can directly update the user's profile
    const isSelfUpdate = loggedInUser._id.toString() === userId;
    if (isSelfUpdate && !currentPassword) {
      return res.status(400).json({ message: "Current password is required to update your profile." });
    }
    
    // Handle password change if new password is provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password." });
      }

       // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }

       // Validate new password
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long." });
      }
    }

    
    // Prepare update object
    const updates = {
      fullName,
      email,
      password: newPassword
    };


    if (newPassword) {
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true, select: "-password" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch user profile", 
      message: err.message 
    });
  }
};

// ✅ deleteUser Controller

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// total number of burrowers;
export const getBurrowerCount = async (req, res)=>{
  try {
    const count = await userModel.countDocuments({role: "burrower"});

    res.status(200).json({burrowerCount: count});
  } catch (error) {
    console.error("Error fetching borrower count:", error);
    res.status(500).json({message: "Internel server error."})
  }
}

//get all users data:
export const getAllUsersData = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 }); // newest first
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};