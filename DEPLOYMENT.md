# Carpool Connect - Deployment Guide

## ✅ Deployment Status

### Frontend (Vercel)
- **Status**: Deployed ✅
- **URL**: https://imp-pearl.vercel.app
- **Alternative URL**: https://imp-4psto23p3-zainabs-projects-7c3d81a5.vercel.app

### Backend (ngrok)
- **Status**: Running locally with ngrok tunnel ✅
- **ngrok URL**: https://unsoporiferous-ruinously-gertie.ngrok-free.dev
- **Local Port**: 4000
- **MongoDB**: Local MongoDB on port 27017

## 🚀 How to Run the Backend

### Prerequisites
1. MongoDB must be running locally
2. Node.js installed
3. ngrok installed and authenticated

### Steps to Start Backend

1. **Start MongoDB** (if not already running):
   ```powershell
   # Make sure MongoDB service is running
   ```

2. **Start the Backend Server**:
   ```powershell
   cd d:\imp\backend
   node index.js
   ```
   You should see:
   ```
   Server Running on port 4000
   Connected To MongoDB successfully
   TTL index created on collection "messages" for field "createdAt"
   ```

3. **Start ngrok** (in a new terminal):
   ```powershell
   ngrok http 4000
   ```
   
   ngrok will provide you with a public URL like:
   ```
   Forwarding: https://your-ngrok-url.ngrok-free.dev -> http://localhost:4000
   ```

### ⚠️ Important: When ngrok URL Changes

If ngrok restarts and provides a new URL, you need to:

1. **Update backend/.env**:
   ```env
   FRONTEND_URL=https://imp-pearl.vercel.app
   ```

2. **Update the Frontend Environment Variables on Vercel**:
   - Go to https://vercel.com/dashboard
   - Select your project "imp"
   - Go to Settings → Environment Variables
   - Update:
     - `REACT_APP_BACKEND_URL` = your new ngrok URL
     - `REACT_APP_SOCKET_URL` = your new ngrok URL
   - Redeploy from the Deployments tab

3. **Or Redeploy with Updated vercel.json**:
   Update `vercel.json` with the new ngrok URL and run:
   ```powershell
   cd d:\imp
   vercel --prod
   ```

## 🔧 Configuration Files

### Backend Configuration (backend/.env)
```env
PORT=4000
FRONTEND_URL=https://imp-pearl.vercel.app
MONGODB_URI=mongodb://127.0.0.1:27017/ChatSystem
```

### Frontend Configuration (.env)
```env
REACT_APP_BACKEND_URL=https://unsoporiferous-ruinously-gertie.ngrok-free.dev
REACT_APP_SOCKET_URL=https://unsoporiferous-ruinously-gertie.ngrok-free.dev
```

## 🛠️ CORS Configuration

The backend has been configured to accept requests from:
- localhost:3000 (development)
- localhost:3001 (alternative dev port)
- Any Vercel deployment (*.vercel.app)
- The specific frontend URL in FRONTEND_URL environment variable

## 🔥 Features Implemented

### Backend
- ✅ Dynamic CORS configuration for Vercel and ngrok
- ✅ Socket.io with proper CORS settings
- ✅ Environment variable support
- ✅ MongoDB connection with TTL indexes
- ✅ Chat message persistence
- ✅ Real-time messaging with Socket.io

### Frontend
- ✅ Environment-based configuration
- ✅ Vercel deployment with optimized build
- ✅ Socket.io client configuration
- ✅ API integration with backend
- ✅ Web3 integration for blockchain features

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors:
1. Verify the FRONTEND_URL in backend/.env matches your Vercel deployment
2. Restart the backend server after changing .env
3. Check that ngrok is running and the URL is correct

### 404 Errors in Chat
If chat messages show 404 errors:
1. Verify ngrok is running and forwarding to port 4000
2. Check that backend server is running
3. Verify the REACT_APP_BACKEND_URL in frontend matches the ngrok URL

### Socket Connection Errors
If socket.io doesn't connect:
1. Verify REACT_APP_SOCKET_URL matches the ngrok URL
2. Check browser console for connection errors
3. Verify ngrok tunnel is active
4. Check backend logs for connection attempts

## 📝 Quick Start Commands

### Start Everything
```powershell
# Terminal 1: Start Backend
cd d:\imp\backend
node index.js

# Terminal 2: Start ngrok
ngrok http 4000

# Terminal 3: Local Development (optional)
cd d:\imp
npm start
```

### Deploy Frontend to Vercel
```powershell
cd d:\imp
vercel --prod
```

### View ngrok Web Interface
Open http://127.0.0.1:4040 in your browser to see:
- Request logs
- Request/response details
- Traffic statistics

## 🔗 Important URLs

- **Frontend (Production)**: https://imp-pearl.vercel.app
- **Backend (ngrok)**: https://unsoporiferous-ruinously-gertie.ngrok-free.dev
- **ngrok Dashboard**: http://127.0.0.1:4040
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/zainab-06-p/Carpool-Connect.git

## 📦 Dependencies

### Backend
- express
- socket.io
- cors
- mongoose
- dotenv

### Frontend
- react
- socket.io-client
- axios
- web3
- react-router-dom
- And many more (see package.json)

## 🎯 Notes

- ngrok free tier URLs change every time you restart ngrok
- MongoDB data persists locally
- Chat messages expire after 1 hour (TTL configuration)
- The frontend is static and hosted on Vercel's CDN
- The backend must run locally with ngrok for this setup

## ✨ Deployment Complete!

Your application is now deployed with:
- ✅ Frontend on Vercel (static hosting)
- ✅ Backend locally with ngrok tunnel
- ✅ CORS properly configured
- ✅ Socket.io working with real-time chat
- ✅ No 404 or CORS errors

Access your application at: https://imp-pearl.vercel.app
