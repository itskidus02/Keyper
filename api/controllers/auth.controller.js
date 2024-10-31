import User from '../models/user.model.js';
import crypto from 'crypto';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Generate a salt and derive a 32-byte key from the password
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  
  const newUser = new User({ 
    username, 
    email, 
    password: key.toString('hex'),
    salt
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    // Derive key from password using stored salt
    const key = crypto.pbkdf2Sync(password, validUser.salt, 100000, 32, 'sha256');
    const isValidPassword = key.toString('hex') === validUser.password;

    if (!isValidPassword) return next(errorHandler(401, 'wrong credentials'));

    const token = jwt.sign({ 
      id: validUser._doc._id,
      key: key.toString('hex') // Include encryption key in JWT
    }, process.env.JWT_SECRET);

    const { password: storedKey, salt, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};