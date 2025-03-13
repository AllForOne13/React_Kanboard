import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// login handler
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body; 

  try {
    // check if user exists in the database
    const user = await User.findOne({ where: { username } }); 
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    //validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare password with hash
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // generate a JWT token
    const payload = { username: user.username, id: user.id }; // JWT payload
    const secretKey = process.env.JWT_SECRET as string; // JWT secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // respond with the token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error); 
    res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
