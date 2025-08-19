import jwt from 'jsonwebtoken';
import Message from './models/Message.js';

// In-memory map: userId -> socketId
const onlineUsers = new Map();

export const setupSocket = (io) => {
  io.use((socket, next) => {
    // Expect token in query: ?token=JWT
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('No token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.id, email: payload.email };
      next();
    } catch (e) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);
    io.to(socket.id).emit('connection-status', { status: 'Connected' });
    io.emit('presence', { userId, online: true });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('presence', { userId, online: false });
    });

    // Receive message
    socket.on('chat-message', async (payload) => {
      // payload: { to, text }
      const msg = await Message.create({
        from: userId,
        to: payload.to,
        text: payload.text
      });

      const data = {
        id: String(msg._id),
        from: String(msg.from),
        to: String(msg.to),
        text: msg.text,
        createdAt: msg.createdAt
      };

      // Emit to sender
      io.to(socket.id).emit('chat-message', data);

      // Emit to recipient if online
      const recipientSocketId = onlineUsers.get(payload.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('chat-message', data);
      }
    });

    // Fetch last N messages with a specific user
    socket.on('fetch-messages', async ({ withUserId, limit = 50 }) => {
      const userId = socket.user.id;
      const msgs = await Message.find({
        $or: [
          { from: userId, to: withUserId },
          { from: withUserId, to: userId }
        ]
      }).sort({ createdAt: 1 }).limit(limit).lean();
      io.to(socket.id).emit('messages', msgs.map(m => ({
        id: String(m._id),
        from: String(m.from),
        to: String(m.to),
        text: m.text,
        createdAt: m.createdAt
      })));
    });
  });
};
