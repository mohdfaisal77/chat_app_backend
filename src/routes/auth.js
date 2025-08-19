import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({message:'Email and password required'});
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({message:'Email already in use'});
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    return res.json({ id: user._id, email: user.email });
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, email: user.email } });
  } catch (e) {
    return res.status(500).json({message: e.message});
  }
});

export default router;
