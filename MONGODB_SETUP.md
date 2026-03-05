# MongoDB Setup Guide for HealthTrack

This guide walks you through setting up MongoDB Atlas for the HealthTrack application.

## Step 1: Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** and create a free account
3. Choose "Free" tier when prompted
4. Fill in your account details and verify your email

## Step 2: Create a Cluster

1. After login, click **Create a Deployment**
2. Select **M0 Sandbox** (free tier)
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to you
5. Click **Create Deployment**
6. Wait for cluster to be ready (usually 2-3 minutes)

## Step 3: Create a Database User

1. In the left sidebar, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** as the authentication method
4. Enter username (e.g., `healthtrack_user`)
5. Enter a strong password (save this!)
6. Built-in role: Select **Atlas User** → **Read and write to any database**
7. Click **Add User**

## Step 4: Whitelist Your IP Address

1. In the left sidebar, go to **Network Access**
2. Click **Add IP Address**
3. For development: Click **Add Current IP Address**
4. For production: Add Vercel's IP ranges (ask Vercel support)
5. Click **Confirm**

## Step 5: Get Connection String

1. Go to **Databases** → **Connect**
2. Choose **Connect your application**
3. Select **Node.js** as driver
4. Copy the connection string
5. It will look like:
```
mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.abc123.mongodb.net/<DATABASE>?retryWrites=true&w=majority
```

## Step 6: Update Connection String

Replace placeholders in the connection string:

- `<USERNAME>`: Your database user username (e.g., `healthtrack_user`)
- `<PASSWORD>`: Your database user password
- `<DATABASE>`: Database name (e.g., `healthtrack`)

**Example:**
```
mongodb+srv://healthtrack_user:MySecurePassword123@cluster0.abc123.mongodb.net/healthtrack?retryWrites=true&w=majority
```

## Step 7: Configure Your Application

1. Create `.env.local` file in the project root:
```bash
cp example.env .env.local
```

2. Edit `.env.local` and update:
```env
MONGODB_URI=mongodb+srv://healthtrack_user:MySecurePassword123@cluster0.abc123.mongodb.net/healthtrack?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-here-change-in-production
NODE_ENV=development
```

## Step 8: Test Connection

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. The app will automatically test the MongoDB connection
4. Visit http://localhost:3000 to verify it works

## Troubleshooting

### Connection Timeout
- **Problem**: "connect ECONNREFUSED" or timeout error
- **Solution**: 
  - Verify your IP is whitelisted in Network Access
  - Check username and password are correct in connection string
  - Ensure `.env.local` has correct `MONGODB_URI`

### Authentication Failed
- **Problem**: "authentication failed" error
- **Solution**:
  - Double-check username and password (case-sensitive!)
  - Verify special characters in password are URL-encoded
  - Reset password in Database Access if unsure

### Database Not Found
- **Problem**: Collection doesn't exist when trying to query
- **Solution**:
  - This is normal - MongoDB creates collections on first insert
  - Just register and start using the app
  - Collections will be created automatically

### IP Address Issues
- **Problem**: "ip not in whitelist" error
- **Solution**:
  - Add your current IP in Network Access
  - For mobile/VPN: Use 0.0.0.0/0 for development only (not secure)
  - For production: Contact Vercel for their IP ranges

## Best Practices

### Security
1. **Never commit `.env.local` to git** - add to `.gitignore`
2. **Use strong passwords** - mix uppercase, lowercase, numbers, special characters
3. **Rotate credentials regularly** - change password every 90 days
4. **Use environment variables** - never hardcode connection string

### Performance
1. **Enable connection pooling** - MongoDB does this automatically
2. **Create indexes** - done automatically for ObjectIds
3. **Monitor database** - use MongoDB Atlas dashboard

### Monitoring
1. Monitor your database usage in Atlas Dashboard
2. Set up alerts for unusual activity
3. Check performance metrics regularly

## For Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. In Vercel dashboard → Settings → Environment Variables:
   - Add `MONGODB_URI` (your MongoDB connection string)
   - Add `JWT_SECRET` (strong random string)
4. Deploy!

### MongoDB Atlas for Production

1. Create a production cluster (not M0 sandbox)
2. Enable backup (optional but recommended)
3. Use dedicated user with limited permissions
4. Whitelist Vercel's IP ranges only
5. Enable encryption at rest
6. Set up monitoring and alerts

## FAQ

**Q: Is the free tier good enough?**
A: Yes! M0 free tier includes:
- 512MB storage
- 3 shared nodes
- Up to 100,000 documents
- Perfect for getting started

**Q: How do I backup my data?**
A: MongoDB Atlas handles daily backups automatically. You can also:
- Export data from Atlas UI
- Create manual backups
- Use mongodump command

**Q: Can I migrate from PostgreSQL to MongoDB?**
A: The application is built for MongoDB. To use PostgreSQL instead, you'd need to use the git history to find the PostgreSQL version.

**Q: What's the difference between free and paid clusters?**
A: Free (M0):
- Shared resources
- 512MB storage
- Good for development

Paid (M2+):
- Dedicated resources
- Unlimited storage (per size)
- Better performance
- Production-ready

**Q: How do I delete my cluster?**
A: In Atlas Dashboard → Databases → Cluster Settings → Terminate Cluster. Be careful - this deletes all data!

## Need Help?

- MongoDB Docs: https://docs.mongodb.com/
- Atlas FAQ: https://docs.mongodb.com/manual/faq/fundamentals/
- HealthTrack README: See README.md for more info
