# Second Brain 🧠

A simple web app to save and organize your favorite YouTube videos, Twitter posts, and documents. Share your collection with friends!

## 🌐 Live Demo

**Try the app now**: [https://brainly-app-bice.vercel.app](https://brainly-app-bice.vercel.app)

> **Note**: Backend is hosted on Render's free tier and may sleep after inactivity. If the app seems slow or unresponsive, click the backend link below to wake it up, then refresh the main app.

**Wake up backend**: [https://brainlyapp.onrender.com](https://brainlyapp.onrender.com)

## Test Credentials
Username- Siraj
Password- Siraj@123

### Test the Application:

1. **Sign Up**: Create a new account or sign in
2. **Add Content**: Try adding YouTube videos, Twitter posts, or documents
3. **Filter**: Use the sidebar to filter by content type
4. **Share**: Generate a shareable link to test the sharing feature

## What does it do?

- Save YouTube videos, Twitter posts, and documents
- Filter your content by type (YouTube, Twitter, Documents)
- Share your entire collection with a link
- View other people's shared collections

## Technologies Used

- **Frontend**: React + TypeScript + Tailwind CSS (Deployed on Vercel)
- **Backend**: Node.js + Express + TypeScript (Deployed on Render)
- **Database**: MongoDB Atlas

## How to Run

### You Need:

- Node.js installed on your computer
- A MongoDB Atlas account (free)

### Step 1: Download the Code

```bash
git clone https://github.com/yourusername/second-brain.git
cd second-brain
```

### Step 2: Install Everything

```bash
npm run install-all
```

### Step 3: Setup Backend

Create a `.env` file in the Backend folder:

```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_CLUSTER=your_cluster_url
MONGODB_DATABASE=SecondBrain
JWT_SECRET=any_random_string_here
PORT=3000
```

### Step 4: Start the App

```bash
npm run dev
```

### Step 5: Open the App

Go to: http://localhost:5173

## How to Use

1. **Sign Up**: Create an account
2. **Add Content**: Click "Add Content" and paste YouTube/Twitter links or document URLs
3. **Filter**: Use the sidebar to filter by content type
4. **Share**: Click "Share" to get a link you can send to others

## Project Structure

```
├── Backend/          # Server code
│   ├── src/
│   └── .env         # Your secret keys (don't share this!)
├── Frontend/        # Website code
│   └── src/
└── README.md       # This file
```

## Need Help?

If something doesn't work:

1. Make sure Node.js is installed
2. Check that your MongoDB connection string is correct
3. Make sure both frontend and backend are running

## Want to Deploy?

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add `vercel.json` file for React Router support:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
4. Deploy automatically

### Backend (Render)

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Set Root Directory to `Backend`
4. Add environment variables:
   ```
   JWT_SECRET=your_secret_key
   MONGODB_USERNAME=your_username
   MONGODB_PASSWORD=your_password
   MONGODB_CLUSTER=your_cluster_url
   MONGODB_DATABASE=your_database_name
   ```
5. Deploy automatically

### Database

- **MongoDB Atlas**: Free tier available (already cloud-based)

---

Made with ❤️ for organizing your digital life!
