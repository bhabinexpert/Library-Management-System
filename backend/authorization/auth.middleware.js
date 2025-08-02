import jwt from 'jsonwebtoken';
import User from "../models/user.models.js";


export const protect = async (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        const token = authHeader.split(" ")[1];


        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
            
        }
    }else {
    return res.status(401).json({ message: "No token provided" });
  }
}