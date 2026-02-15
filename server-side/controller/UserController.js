//Controller for User Registration & Login & Getting User By ID & Getting User Resumes

//Controller for User Registration
//POST :api/users/register

import Resume from "../models/Resume.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if the fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    //Check if User already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    //Else Create New User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(201) // 201 Created when you create a new resource
      .json({ message: "User created successfully!.", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Controller for User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if User exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    //Check if password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid password." });
    }
    //Return success message
    const token = generateToken(user._id);
    user.password = "undefined";
    return res.status(200).json({ message: "Login successful!", token, user }); //200 for successful operations that retrieve or update existing resources
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Controller to get user by id
//GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId; //middleware gives userId to request (req)

    //Check if User exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Controller to get user resumes
//GET: /api/users/resumes

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    //Return User Resumes by using the userId passed by request
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
