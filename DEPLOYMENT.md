# Vercel Deployment Guide

This guide will help you deploy the Carpool Connect application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm install -g vercel`
3. MongoDB Atlas account for cloud database (https://www.mongodb.com/cloud/atlas)

## Database Setup (MongoDB Atlas)

Since Vercel doesn't host databases, you'll need to use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with a password
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel access
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/ChatSystem`)

## Backend Deployment

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **carpool-backend** (or your choice)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. After deployment, add environment variables:
   ```
   vercel env add MONGODB_URI
   ```
   Paste your MongoDB Atlas connection string

   ```
   vercel env add FRONTEND_URL
   ```
   Enter: `https://your-frontend-url.vercel.app` (you'll get this after frontend deployment)

5. Redeploy to apply environment variables:
   ```
   vercel --prod
   ```

6. Note your backend URL (e.g., `https://carpool-backend.vercel.app`)

## Frontend Deployment

1. Navigate back to the root folder:
   ```
   cd ..
   ```

2. Update your frontend API calls to use the backend URL:
   - Replace `http://localhost:4000` with your Vercel backend URL
   - Update Socket.IO connection URLs

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **carpool-frontend** (or your choice)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. Deploy to production:
   ```
   vercel --prod
   ```

6. Note your frontend URL (e.g., `https://carpool-frontend.vercel.app`)

7. Update the backend's FRONTEND_URL environment variable:
   ```
   cd backend
   vercel env add FRONTEND_URL production
   ```
   Enter your frontend URL

   Redeploy backend:
   ```
   vercel --prod
   ```

## Important Notes

- Socket.IO connections work on Vercel but have limitations with serverless functions
- For better WebSocket support, consider using Vercel's Edge Functions or a dedicated WebSocket service
- Free tier has limitations on function execution time (10 seconds for Hobby plan)
- Database connections are created per serverless function invocation

## Alternative: Deploy via GitHub Integration

You can also deploy by connecting your GitHub repository:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. For Frontend:
   - Root Directory: `./`
   - Framework Preset: Create React App
4. For Backend:
   - Create a separate project
   - Root Directory: `./backend`
   - Add environment variables in the Vercel dashboard

## Testing

After deployment:
1. Visit your frontend URL
2. Test the chat functionality
3. Check Vercel logs for any errors: `vercel logs`

## Troubleshooting

- If you encounter CORS errors, ensure FRONTEND_URL is set correctly in backend
- For database connection errors, verify your MongoDB Atlas connection string and IP whitelist
- Check Vercel function logs in the dashboard for detailed error messages
