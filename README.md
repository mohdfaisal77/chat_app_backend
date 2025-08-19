# Real-Time Chat Application - Backend (Node.js + Express + MongoDB)

This is the backend server for the **Real-Time Chat Application**.  
It provides REST APIs for authentication and users, stores chat messages in MongoDB, and uses **Socket.IO** for real-time communication.

---

##  Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing

---

##  Architecture Brief
The backend is structured into:

- **Models** → Define MongoDB schemas (`User`, `Message`)  
- **Routes** → REST APIs (`auth`, `users`, `messages`)  
- **Middleware** → JWT auth verification  
- **Socket.IO** → Real-time chat (connection, presence, message delivery)  
- **Config** → MongoDB connection (`db.js`)  

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/mohdfaisal77/chat_app_backend.git
cd chat_app_backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root (already included in your repo for local testing):

```env
MONGO_URI=mongodb://127.0.0.1:27017/chat_app_assignment
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

- `MONGO_URI` → MongoDB connection string (local or Atlas)  
- `JWT_SECRET` → Secret key for signing JWT tokens  
- `PORT` → Backend server port (default: 4000)  

### 4. Start the server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will run at:  
```
http://localhost:4000
```

---

##  Project Structure

```
chat_app_backend/
 ├── config/
 │    └── db.js             # MongoDB connection
 ├── middleware/
 │    └── auth.js           # JWT authentication middleware
 ├── models/
 │    ├── User.js           # User schema
 │    └── Message.js        # Message schema
 ├── routes/
 │    ├── auth.js           # Signup & login routes
 │    ├── users.js          # Fetch users
 │    └── messageRoutes.js  # Send & fetch chat messages
 ├── socket.js              # Socket.IO events
 ├── index.js               # App entry point
 ├── .env                   # Environment variables
 └── package.json
```

---

##  API Documentation

### Authentication Routes
- **POST `/api/auth/signup`**  
  Request body:
  ```json
  { "email": "test@example.com", "password": "123456" }
  ```
  Response:
  ```json
  { "id": "userId", "email": "test@example.com" }
  ```

- **POST `/api/auth/login`**  
  Request body:
  ```json
  { "email": "test@example.com", "password": "123456" }
  ```
  Response:
  ```json
  {
    "token": "JWT_TOKEN",
    "user": { "id": "userId", "email": "test@example.com" }
  }
  ```

---

### User Routes
- **GET `/api/users`**  
  Headers: `Authorization: Bearer <JWT_TOKEN>`  
  Response:
  ```json
  [
    { "_id": "123", "email": "alice@example.com" },
    { "_id": "456", "email": "bob@example.com" }
  ]
  ```

---

### Message Routes
- **POST `/api/messages/send`**  
  Headers: `Authorization: Bearer <JWT_TOKEN>`  
  Body:
  ```json
  { "to": "receiverId", "text": "Hello there!" }
  ```
  Response:
  ```json
  { "_id": "...", "from": "userId", "to": "receiverId", "text": "Hello there!" }
  ```

- **GET `/api/messages/:peerId`**  
  Fetch messages between authenticated user and `peerId`.  
  Response:
  ```json
  [
    { "from": "123", "to": "456", "text": "Hi!", "createdAt": "..." }
  ]
  ```

---

### Socket.IO Events
- **Connection** → Authenticated with JWT (`socket.auth.token`)  
- **`chat-message`** → Send `{ to, text }`, receive real-time `{ id, from, to, text, createdAt }`  
- **`fetch-messages`** → Request `{ withUserId, limit }`, receive message history  
- **Presence** → Emits `{ userId, online: true/false }`  
- **Disconnect** → Emits user offline status  

---

## 👤 Example Users
```json
{
  "email": "alice@example.com",
  "password": "123456"
}
{
  "email": "bob@example.com",
  "password": "123456"
}
```

---

##  Dependencies
From `package.json`:
- express → Web server framework  
- mongoose → MongoDB ORM  
- socket.io → Real-time engine  
- jsonwebtoken → JWT auth  
- bcryptjs → Password hashing  
- cors → Cross-origin support  
- dotenv → Environment variables  

Dev dependency:
- nodemon → Auto-reload during development  

---

