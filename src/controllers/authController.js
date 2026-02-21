import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

//generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, techStack } = req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      techStack,
    });
    //generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      techStack: user.techStack,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//login user
export const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        //check password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        //generate token
        const token = generateToken(user._id);

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            techStack:user.techStack,
            token,
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
