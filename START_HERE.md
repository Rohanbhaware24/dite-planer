# 🚀 START HERE - HealthTrack MongoDB Setup

Welcome! Follow this simple guide to get HealthTrack running in minutes.

## The 3-Minute Setup

### ⏱️ Minute 1: Create MongoDB Account

```
1. Open: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account (FREE!)
4. Verify email
```

### ⏱️ Minute 2: Get Connection String

```
1. Create a cluster (M0 - FREE forever!)
2. Create a database user
   - Username: healthtrack
   - Password: MyPassword123!
3. Allow network access (your IP)
4. Click "Connect" → "Connect Application"
5. Copy the connection string
   Example: mongodb+srv://healthtrack:MyPassword123!@cluster0.abc.mongodb.net/...
```

### ⏱️ Minute 3: Add to Your App

```
1. Create file: .env.local (in root directory)
2. Add two lines:
   MONGODB_URI=<paste your connection string>
   JWT_SECRET=anySecretKeyHere
3. Save file
4. Run: pnpm dev
5. Open: http://localhost:3000
```

## Done! 🎉

Your app is now connected to MongoDB!

---

## What If Something Goes Wrong?

### ❌ "Cannot connect to MongoDB"
- Check your connection string in `.env.local`
- Verify username and password are correct
- Make sure your IP is whitelisted in MongoDB

### ❌ "Port 3000 already in use"
```bash
# Kill the process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ "Module not found"
```bash
# Reinstall dependencies
pnpm install
```

### ❌ "Still not working?"
Check detailed guides:
- `SETUP_INSTRUCTIONS.md` - Full setup guide
- `MONGODB_SETUP.md` - MongoDB detailed guide
- `QUICKSTART.md` - Quick reference

---

## Quick Tour

Once running, try these:

1. **Sign Up**
   ```
   Email: test@example.com
   Password: password123
   Name: Test User
   ```

2. **Create Profile**
   - Add age, height, weight
   - Set your fitness goal
   - Save

3. **Create Diet Plan**
   - Choose a diet type
   - Set daily calories
   - Save

4. **Log Meals**
   - Dashboard → Add Meal
   - Log breakfast, lunch, dinner
   - Watch calories update

5. **Track Progress**
   - Progress tab → Log Weight
   - Add measurements (optional)
   - View your chart!

---

## Project Files

```
HealthTrack/
│
├── 📖 START_HERE.md ← You are here!
├── 📖 SETUP_INSTRUCTIONS.md ← Detailed setup
├── 📖 QUICKSTART.md ← Quick reference
├── 📖 MONGODB_SETUP.md ← MongoDB help
├── 📖 README.md ← Full documentation
│
├── .env.local ← Create this file with your MongoDB URI
├── example.env ← Template for environment
│
├── app/
│   ├── api/ ← All API endpoints
│   ├── dashboard/ ← Your dashboard
│   ├── login/ ← Login page
│   ├── register/ ← Signup page
│   └── page.tsx ← Home page
│
├── lib/
│   ├── models/ ← MongoDB schemas
│   ├── auth.ts ← Authentication
│   └── mongodb.ts ← Connection
│
└── components/ ← React components
```

---

## Environment Variables Explained

Your `.env.local` file has 2 things:

```env
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Secret key for JWT (can be anything for development)
JWT_SECRET=my-secret-key-12345
```

### Getting MONGODB_URI

1. Login to MongoDB Atlas
2. Go to Databases
3. Click "Connect"
4. Select "Connect your application"
5. Copy the string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with a database name (e.g., `healthtrack`)

### Example Connection String
```
mongodb+srv://healthtrack:MyPassword123!@cluster0.abc123.mongodb.net/healthtrack?retryWrites=true&w=majority
```

---

## Commands You'll Need

```bash
# Install dependencies (do this first!)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

---

## Feature Checklist

Once running, verify these work:

- [ ] Sign up
- [ ] Login
- [ ] View dashboard
- [ ] Create diet plan
- [ ] Log meals
- [ ] Log progress
- [ ] View progress chart
- [ ] View analytics
- [ ] Log water intake
- [ ] Calculate BMI

All should work immediately after setup!

---

## Deployment (When Ready)

Deploy to Vercel in 3 steps:

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository and add:
   ```
   MONGODB_URI=<your-connection-string>
   JWT_SECRET=<strong-random-key>
   ```

Done! 🚀

---

## Need Help?

### Before Setup
- Check `MONGODB_SETUP.md` for MongoDB help
- Check example MongoDB connection steps

### After Setup
- Check `SETUP_INSTRUCTIONS.md` for troubleshooting
- Check `QUICKSTART.md` for common issues
- Check `README.md` for API documentation

### MongoDB Help
- Visit: https://docs.mongodb.com/
- Atlas Dashboard: https://www.mongodb.com/cloud/atlas

---

## Success!

When you see this:
```
> next dev
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

Your app is running! Open that URL in your browser.

---

## Next Steps After Setup

1. ✅ Create an account
2. ✅ Fill in your health profile  
3. ✅ Create your first diet plan
4. ✅ Start logging meals
5. ✅ Track your progress!

---

## Important Notes

⚠️ **Never commit `.env.local` to Git!**
- It contains your passwords
- It's already in `.gitignore`

✅ **Use strong passwords for MongoDB**
- Mix uppercase, lowercase, numbers, symbols
- Don't use simple passwords

✅ **Keep your JWT_SECRET secret**
- Change it before deploying to production
- Use a cryptographically secure string

---

## Common MongoDB Connection String Mistakes

```bash
# ❌ Wrong - Missing password
mongodb+srv://healthtrack@cluster0.abc.mongodb.net/healthtrack

# ❌ Wrong - Password not URL encoded
mongodb+srv://healthtrack:Pass@word@cluster0.abc.mongodb.net/healthtrack

# ❌ Wrong - Missing database name
mongodb+srv://healthtrack:password@cluster0.abc.mongodb.net/

# ✅ Correct
mongodb+srv://healthtrack:password@cluster0.abc.mongodb.net/healthtrack?retryWrites=true&w=majority
```

---

## That's It!

You're ready to launch HealthTrack. Enjoy tracking your health! 💪

Questions? Check the documentation files in the project.

**Happy tracking!** 🎉
