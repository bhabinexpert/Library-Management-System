import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import userModel from '../models/user.models.js';
import { data } from 'react-router-dom';

//Signup Controller!!

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if user already exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User with the provided email address already exists.",
      });
    }

    // 2. Hash the password
    const hashedPw = await bcrypt.hash(password, 10);

    // 3. Save the user
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPw,
    });

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
   

    // 6. Send success response
    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: newUser,
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};


export async function loginUser(req, res){

    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required!"})
        }

        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({message: "Invalid Email address!"})
        }

        const isUserMatch = await bcrypt.compare(password, user.password)
        if(!isUserMatch) return res.status(400).json({message: "Invalid Credentials!"})
        

        // Jwt token:
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: "1d",});

        res.status(200).json({
            message: "Login Successfull",
            token,
            user: {
            _id : user._id,
            name: user.fullName,
            email: user.email
        },
        })
        
    }catch (err){
         console.log("Errror while login:"), err;
        req.status(500).json({ message: "Internal server error!" });
    }
}