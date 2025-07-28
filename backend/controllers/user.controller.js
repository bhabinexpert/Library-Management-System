import bcrypt from "bcrypt";
import userModel from "../models/user.models";

export async function createUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!email ||
            !fullName ||
            !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return res.status(400).json({message:'This email already exist'})
        }

        const hasedPassword =await bcrypt.hash(password, 10)

        const userData = await userModel.create({
            fullName,
            email,
            password: hasedPassword
        });
        return res.status(201).json({message: "User created successfully", userData})
    } catch (error) { 
        console.log("Error", error)
        res.status(500).json({message: "Internal server Error"})
    }
}
