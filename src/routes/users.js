import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Optional user list to pick a chat partner
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, { email: 1 }).lean();
    res.json(users.filter(u => String(u._id) !== String(req.user.id)));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;