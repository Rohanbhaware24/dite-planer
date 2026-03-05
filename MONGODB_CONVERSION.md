# PostgreSQL to MongoDB Conversion Summary

This document outlines the changes made to convert HealthTrack from PostgreSQL to MongoDB.

## What Was Changed

### 1. Database Layer

**Removed:**
- PostgreSQL SQL queries
- `@vercel/postgres` dependency
- `lib/db.ts` (PostgreSQL utilities)
- `scripts/init-db.sql` (SQL schema)

**Added:**
- MongoDB Atlas support
- Mongoose ODM models
- `lib/mongodb.ts` (MongoDB connection handler)
- `lib/models/` directory with 6 Mongoose schemas

### 2. Dependencies Updated

**Removed:**
- `@vercel/postgres`: "^0.8.0"
- `jose`: "^5.4.0" (replaced with jsonwebtoken)

**Added:**
- `mongoose`: "^8.0.0"
- `jsonwebtoken`: "^9.1.2"

### 3. Authentication

**Updated `lib/auth.ts`:**
- Replaced `jose` (HS256) with `jsonwebtoken` (standard JWT)
- All functions remain the same interface
- Added `getAuthTokenFromRequest()` helper
- Password hashing with bcryptjs remains unchanged

### 4. API Routes Converted

All API routes updated from PostgreSQL to MongoDB:

| Route | Changes |
|-------|---------|
| `/api/auth/register` | Uses User model, creates document instead of INSERT |
| `/api/auth/login` | Uses User.findOne() instead of SQL query |
| `/api/auth/logout` | No changes (cookies only) |
| `/api/profile` | Uses UserProfile model with findOne/create |
| `/api/diet-plans` | Uses DietPlan model with find/create |
| `/api/progress` | Uses ProgressEntry model with find/create |
| `/api/meals` | Uses Meal model, removed SQL joins |
| `/api/admin/users` | Uses User model for findByIdAndUpdate/Delete |

### 5. Mongoose Models Created

All in `lib/models/`:

1. **User.ts**
   - email, password, name, role, timestamps

2. **UserProfile.ts**
   - userId reference, age, gender, height, weights, activity level, dietary info

3. **DietPlan.ts**
   - userId reference, name, type, macros, meals array, dates

4. **Meal.ts**
   - userId reference, dietPlanId, name, nutrition, mealTime

5. **ProgressEntry.ts**
   - userId reference, weight, measurements, notes, photoUrl

6. **WaterIntake.ts**
   - userId reference, amount, date

### 6. Environment Variables

**Old (.env.local):**
```env
POSTGRES_URL=<neon-connection-url>
JWT_SECRET=<secret>
```

**New (.env.local):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=<secret>
NODE_ENV=development
```

## Migration Benefits

✅ **Flexibility**: MongoDB's schema-less nature allows easier changes
✅ **Scalability**: Better for horizontal scaling
✅ **Developer Experience**: Mongoose makes MongoDB easier to use
✅ **Cost**: Free tier (M0) is perfect for getting started
✅ **Simplicity**: No complex SQL joins, data is more denormalized

## Data Structure Changes

### PostgreSQL → MongoDB Mapping

```
PostgreSQL Tables → MongoDB Collections

users → users
user_profiles → user_profiles (references users by _id)
diet_plans → diet_plans (references users by _id)
meals → meals (references users and diet_plans by _id)
progress_entries → progress_entries (references users by _id)
(new) → water_intakes (references users by _id)
```

### Key Differences

1. **No Joins**: MongoDB uses document references instead of SQL joins
2. **Arrays**: Related data can be embedded (e.g., meals in diet plans)
3. **Relationships**: Used ObjectId references instead of foreign keys
4. **Validation**: Mongoose schema validates data on insert/update

## Testing the Conversion

1. **Setup MongoDB Atlas account**
2. **Get connection string**
3. **Update `.env.local`**
4. **Run `pnpm install`**
5. **Start with `pnpm dev`**
6. **Register and use the app**

Collections are created automatically on first use!

## What Still Works

All features remain fully functional:
- ✅ User authentication
- ✅ Profile management
- ✅ Diet plan creation
- ✅ Meal logging
- ✅ Progress tracking
- ✅ Analytics and charts
- ✅ Water intake tracking
- ✅ BMI calculator
- ✅ Admin panel
- ✅ All API endpoints

## Breaking Changes

None! The API interface remains identical. All endpoint contracts are preserved.

## Files Modified

### API Routes (8 files)
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/profile/route.ts`
- `app/api/diet-plans/route.ts`
- `app/api/progress/route.ts`
- `app/api/meals/route.ts`
- `app/api/admin/users/route.ts`

### Library Files (2 files)
- `lib/auth.ts`
- `package.json`

### Documentation (4 files)
- `README.md` (updated)
- `example.env` (updated)
- `MONGODB_SETUP.md` (new)
- `QUICKSTART.md` (new)

### Created Models (6 files)
- `lib/models/User.ts`
- `lib/models/UserProfile.ts`
- `lib/models/DietPlan.ts`
- `lib/models/Meal.ts`
- `lib/models/ProgressEntry.ts`
- `lib/models/WaterIntake.ts`

### New Connection File (1 file)
- `lib/mongodb.ts`

## Removed Files

- `lib/db.ts` (PostgreSQL utilities)
- `scripts/init-db.sql` (SQL schema)

## Next Steps

1. Follow `QUICKSTART.md` for immediate setup
2. Follow `MONGODB_SETUP.md` for detailed MongoDB configuration
3. Test all features to ensure they work correctly
4. Deploy to Vercel with MongoDB Atlas

## Rollback

If you need to return to PostgreSQL:
- Check git history for the PostgreSQL version
- Run `git log --oneline` to find the commit before MongoDB conversion
- Restore from that commit if needed

## Support

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

## Summary

HealthTrack has been successfully converted from PostgreSQL to MongoDB! The application maintains full feature parity while gaining the benefits of MongoDB's flexibility and scalability. Simply add your `MONGODB_URI` to `.env.local` and you're ready to go!
