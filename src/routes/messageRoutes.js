import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// send message
router.post("/send", auth, async (req, res) => {
  const { to, text } = req.body;
  try {
    const msg = await Message.create({ 
      from: req.user.id, 
      to, 
      text, 
      createdAt: new Date() 
    });
    res.json(msg);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// get chat messages between two users
router.get("/:peerId", auth, async (req, res) => {
  try {
    const { peerId } = req.params;
    const userId = req.user.id;
    const msgs = await Message.find({ 
      $or: [ 
        { from: userId, to: peerId }, 
        { from: peerId, to: userId } 
      ] 
    }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;