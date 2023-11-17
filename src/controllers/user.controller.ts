import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { zodToFieldErrors } from '@/utils/zodError';

// schemas
import registerSchema from '@/schemas/user/registerSchema';
import loginSchema from '@/schemas/user/loginSchema';
import editProfileSchema from '@/schemas/user/editProfileSchema';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
const JWT_SECRET = process.env.JWT_SECRET;

// auth
const auth = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Fetch the user's profile data from the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's profile data
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

// login
const login = async (req: Request, res: Response) => {
  try {
    // Validate user input
    const { usernameOrEmail, password } = req.body;

    try {
      loginSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json(zodToFieldErrors(error));
    }

    // Check if a user with the provided username or email exists
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    // Verify the provided password against the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    // If the login is successful, generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Respond with the token and user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// register
const register = async (req: Request, res: Response) => {
  try {
    // Extract user data from the request body
    const { username, email, password, ...otherFields } = req.body;

    // Validate user input
    try {
      registerSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json(zodToFieldErrors(error));
    }

    // Check for duplicate email or username
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail) {
      return res.status(400).json({ email: 'Email is already in use' });
    }
    if (existingUsername) {
      return res.status(400).json({ username: 'Username is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in your database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      ...otherFields,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    // Respond with the token and user data
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        ...otherFields,
        // Add other user data fields as needed
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// update user
const update = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Validate and sanitize the user input for profile updates
    try {
      editProfileSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json(zodToFieldErrors(error));
    }

    // Update the user's profile data in the database
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validators for schema validation
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with a success message and the updated user profile data
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

const passwordReset = () => {};
const validatePasswordReset = () => {};

// delete user
const remove = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    console.log(userId);

    // Find and remove the user's account from the database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
};

const UserController = {
  auth,
  login,
  register,
  update,
  passwordReset,
  validatePasswordReset,
  remove,
};

export default UserController;
