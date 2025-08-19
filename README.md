# Chat Backend (Node.js + Express + MongoDB + Socket.IO)

## Quick Start
1. `cp .env.example .env` and set `MONGO_URI`, `JWT_SECRET`, `PORT`.
2. `npm install`
3. `npm run dev` (or `npm start`)

### Routes
- `POST /api/auth/signup` `{ email, password }`
- `POST /api/auth/login` -> `{ token, user }`
- `GET /api/users` (Auth: Bearer token) -> list of other users

### Socket.IO
- Connect with `auth: { token }` in the client.
- Events:
  - `connection-status` -> `{ status }`
  - `presence` -> `{ userId, online }`
  - `chat-message` (send `{ to, text }`, receive message payloads)
  - `fetch-messages` `{ withUserId, limit? }` -> `messages`

MongoDB stores:
- Users
- Messages
