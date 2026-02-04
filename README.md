# Second Brain 🧠

A simple web app to save and organize your favorite YouTube videos, Twitter posts, and documents. Share your collection with friends!

## What does it do?

- Save YouTube videos, Twitter posts, and documents
- Filter your content by type (YouTube, Twitter, Documents)
- Share your entire collection with a link
- View other people's shared collections

## Technologies Used

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB

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

- **Frontend**: Use Vercel or Netlify
- **Backend**: Use Railway or Heroku
- **Database**: MongoDB Atlas (already cloud-based)

---

Made with ❤️ for organizing your digital life!