# HealthTrack Quick Start Guide

Get up and running with HealthTrack in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)

## Quick Setup (5 minutes)

### 1. Get Your MongoDB Connection String (2 min)

```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free) or log in
3. Create a free cluster
4. Create a database user
5. Whitelist your IP
6. Copy connection string
```

Your connection string looks like:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/healthtrack?retryWrites=true&w=majority
```

### 2. Clone and Setup Project (2 min)

```bash
# Copy this project
cd healthtrack

# Install dependencies
pnpm install

# Create .env.local file
cp example.env .env.local
```

### 3. Configure Environment (1 min)

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/healthtrack?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

Replace:
- `username` with your MongoDB user
- `password` with your MongoDB password
- `jwt_secret` with any random string

### 4. Run the App!

```bash
pnpm dev
```

Visit: http://localhost:3000

## First Steps

1. **Create Account**
   - Click "Sign Up"
   - Enter email and password
   - Click "Create Account"

2. **Complete Profile**
   - Add your age, height, current weight
   - Set your goal weight
   - Choose activity level
   - Click "Save Profile"

3. **Create Diet Plan**
   - Go to "Diet Plans"
   - Click "Create New Plan"
   - Choose diet type
   - Set daily calorie target
   - Save the plan

4. **Log Meals**
   - Go to "Dashboard"
   - Click "Add Meal"
   - Log your breakfast, lunch, dinner, snacks
   - Watch your macro tracking update

5. **Track Progress**
   - Go to "Progress"
   - Log your weight daily
   - Add body measurements (optional)
   - View your progress chart!

## Features Overview

| Feature | Location | Purpose |
|---------|----------|---------|
| Profile | Settings | Manage health metrics |
| Diet Plans | Dashboard → Diet Plans | Create personalized plans |
| Meals | Dashboard → Add Meal | Log what you eat |
| Progress | Progress Tab | Track weight & measurements |
| Analytics | Analytics Tab | View charts & trends |
| BMI Calculator | Dashboard | Quick BMI calculation |
| Water Tracker | Dashboard | Log water intake |

## Useful Links

- **Full Setup Guide**: See `MONGODB_SETUP.md` for detailed MongoDB setup
- **Complete Documentation**: See `README.md` for full features and API docs
- **MongoDB Help**: https://www.mongodb.com/docs/

## Troubleshooting

### "Cannot connect to MongoDB"
```
1. Check MONGODB_URI in .env.local
2. Verify username and password are correct
3. Check IP is whitelisted in MongoDB Atlas
4. Restart the dev server
```

### "Database connection timeout"
```
1. Check internet connection
2. Verify MongoDB cluster is running
3. Try adding your current IP again to whitelist
```

### "Cannot login/register"
```
1. Clear browser cookies
2. Check browser console for errors
3. Verify JWT_SECRET is set in .env.local
4. Restart dev server
```

### App won't start
```
1. Run: pnpm install
2. Check Node.js version: node --version (needs 18+)
3. Delete .next folder: rm -rf .next
4. Restart with: pnpm dev
```

## Next Steps

1. **Customize Dashboard**: Edit components in `/components`
2. **Add Features**: Expand API routes in `/app/api`
3. **Deploy**: Push to GitHub and connect to Vercel
4. **Invite Users**: Share your app with friends!

## Deployment (2 minutes)

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Click Deploy!

That's it! Your app is live! 🚀

## Tips

- **Backup Your Data**: Regularly export your data from MongoDB Atlas
- **Change JWT_SECRET**: For production, use a cryptographically secure random string
- **Monitor Database**: Check MongoDB Atlas dashboard for usage
- **Enable Backups**: Optional but recommended for production

## Get Help

Having issues? Try:
1. Check `MONGODB_SETUP.md` for MongoDB help
2. Check `README.md` for API documentation
3. Check your browser's developer console for errors
4. Verify all environment variables are set

## What's Included

✅ User authentication with JWT
✅ Secure password hashing with bcrypt
✅ MongoDB database with Mongoose
✅ Full diet planning system
✅ Meal logging and tracking
✅ Progress tracking with charts
✅ Water intake tracker
✅ BMI calculator
✅ Admin panel
✅ Mobile responsive design
✅ Dark mode support

Happy tracking! 💪
