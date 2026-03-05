# HealthTrack Setup Instructions

Complete MongoDB setup for the HealthTrack application.

## What You Have

✅ Complete Next.js application with all features
✅ MongoDB Mongoose models configured
✅ All API endpoints ready to use
✅ Beautiful UI with Tailwind CSS and shadcn/ui

## What You Need To Do

### Step 1: Create MongoDB Atlas Account (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create free account
3. Verify email
4. Create a new organization and project

### Step 2: Create Free Cluster

1. Click "Create" → "Create a Deployment"
2. Select **M0 Sandbox** (Free forever!)
3. Choose cloud provider (AWS, Google Cloud, or Azure)
4. Select region closest to you
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster to be ready

### Step 3: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Select "Password" authentication
4. Enter username: `healthtrack`
5. Set password: Use something strong like `MySecurePass123!`
6. Role: **Atlas User** (Read and write access)
7. Click **Add User**

**Save your credentials!**
- Username: `healthtrack`
- Password: `MySecurePass123!`

### Step 4: Allow Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Add Current IP Address** (or 0.0.0.0/0 for development)
4. Click **Confirm**

### Step 5: Get Connection String

1. Go to **Databases** → Click **Connect** on your cluster
2. Select **Connect your application**
3. Choose **Node.js** → **4.0 or later**
4. Copy the connection string

It will look like:
```
mongodb+srv://healthtrack:MySecurePass123!@cluster0.abc123def45.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Create `.env.local` File

In the root directory, create a file named `.env.local`:

```bash
# On Mac/Linux
touch .env.local

# On Windows
type nul > .env.local
```

### Step 7: Add Your MongoDB Connection

Edit `.env.local` and paste:

```env
MONGODB_URI=mongodb+srv://healthtrack:MySecurePass123!@cluster0.abc123def45.mongodb.net/healthtrack?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-change-this-to-something-random
NODE_ENV=development
```

**Replace:**
- `healthtrack:MySecurePass123!` with your username:password
- `cluster0.abc123def45` with your actual cluster name
- `my-super-secret-jwt-key...` with any random string (for development, can be anything)

### Step 8: Install Dependencies

```bash
pnpm install
```

### Step 9: Start the Application

```bash
pnpm dev
```

**You should see:**
```
> next dev
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### Step 10: Test the App

1. Open http://localhost:3000 in your browser
2. Click "Sign Up"
3. Create test account
4. Fill in your health profile
5. Create a diet plan
6. Log some meals
7. Check your progress!

**If it works, you're done! 🎉**

## Configuration Details

### MONGODB_URI Explanation

Your connection string has these parts:
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
     ↓          ↓         ↓       ↓        ↓          ↓        ↓
   protocol  user   password  host      port    database   options
```

### JWT_SECRET

This is used for authentication. For production, use a cryptographically secure random string:

```bash
# Generate one using openssl
openssl rand -base64 32
```

For development, any string works.

## File Structure After Setup

```
healthtrack/
├── .env.local              ← Your MongoDB connection here
├── app/
│   ├── api/               ← API endpoints
│   ├── dashboard/         ← Protected routes
│   └── ...
├── lib/
│   ├── models/            ← MongoDB schemas (User, DietPlan, etc)
│   ├── auth.ts            ← Authentication
│   └── mongodb.ts         ← MongoDB connection
├── components/            ← React components
├── public/                ← Static files
├── example.env            ← Copy this to create .env.local
├── QUICKSTART.md          ← Quick reference
├── MONGODB_SETUP.md       ← Detailed MongoDB guide
└── README.md              ← Full documentation
```

## Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"

**Solution:**
1. Check `.env.local` has `MONGODB_URI`
2. Verify username:password is correct
3. Ensure IP is whitelisted in Network Access
4. Check cluster is running (green status)

### ❌ "Authentication failed"

**Solution:**
1. Double-check username and password
2. Special characters in password need URL encoding
3. Reset password in Database Access if unsure

### ❌ "Connection timeout"

**Solution:**
1. Restart dev server: `pnpm dev`
2. Check internet connection
3. Verify MongoDB cluster is running

### ❌ "Cannot register/login"

**Solution:**
1. Clear browser cookies (F12 → Application → Cookies → Delete)
2. Check browser console for errors
3. Restart dev server
4. Verify `.env.local` is saved

## Production Deployment

When ready to deploy to Vercel:

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   ```
   MONGODB_URI=<your-production-mongodb-uri>
   JWT_SECRET=<use-a-strong-random-string>
   ```
5. Click Deploy!

**For production MongoDB:**
- Use a dedicated cluster (not sandbox)
- Enable backups
- Whitelist only Vercel's IP addresses
- Consider paid tier if you expect heavy usage

## Next Steps

1. ✅ Setup complete!
2. 📖 Read `QUICKSTART.md` for first steps
3. 🎯 Create diet plans and track your health
4. 🚀 Deploy to Vercel when ready
5. 👥 Share with friends!

## Getting Help

**If you get stuck:**

1. Check `MONGODB_SETUP.md` for detailed MongoDB help
2. Check `README.md` for API documentation
3. Check browser console (F12) for error messages
4. Check `.env.local` has correct values
5. Restart dev server

## Security Reminders

⚠️ **IMPORTANT:**
1. **Never commit `.env.local` to git!** It's already in `.gitignore`
2. **Don't share your MongoDB password** with anyone
3. **Use strong passwords** for production
4. **Change JWT_SECRET** before deploying to production
5. **Whitelist IPs** instead of allowing 0.0.0.0/0 in production

## You're All Set! 🚀

Your HealthTrack application is now configured with MongoDB and ready to use. Start tracking your health journey today!

Questions? Check the documentation files or MongoDB's official docs at https://docs.mongodb.com/
