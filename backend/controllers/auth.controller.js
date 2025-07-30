import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import userModel from '../models/user.models';
import { data } from 'react-router-dom';

//Signup Controller!!

export const registerUser = async (req, res)=>{
    try {
        const{name, email, password} = req.body;

        //checking the email availability:
        const userExist = await userModel.findOne({email})

         if(userExist){
            return res.status(400).json({message: "User with the provided  Email address already Exist"})
        }

        //hashing the pw

        const hashedPw =  bcrypt.hash(password, 10)

        //Save in the db:

        const newUser = await userModel.create({
            name,
            email,
            password:hashedPw,
        })

        res.status(202).json({message: "User registered Successfully!"})
    } catch (error) {
        res.status(500).json({message: "Error occured", error})
        
    }
}


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
            id: UNSAFE_RemixErrorBoundary,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: "1d",});

        res.status(200).json({
            message: "Login Successfull",
            token,
            user: {
            _id : user._id,
            name: user.name,
            email: user.email
        },
        })
        
    }catch (err){
         console.log("Errror while login:"), err;
    req.status(500).json({ message: "Internal server error!" });
    }
}