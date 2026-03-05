# HealthTrack - Diet & Weight Management Application

A comprehensive full-stack web application for tracking weight, planning personalized meals, and achieving health goals. Built with Next.js, MongoDB, and Tailwind CSS.

## Features

### User Management
- User registration and secure authentication
- JWT-based session management with bcrypt password hashing
- User profile management with health metrics

### Dashboard
- Overview of health statistics
- Weight and BMI tracking
- Diet plan management
- Progress visualization

### Diet Planning
- Create personalized diet plans
- Auto-calculate macronutrients based on diet type (Balanced, High Protein, Low Carb, Keto, Vegan)
- Daily calorie and macro tracking
- Meal management and logging

### Progress Tracking
- Log weight and body measurements
- View progress charts and statistics
- Track trends over time
- Body metrics (chest, waist, hips, thigh, arm circumferences)

### Analytics
- Comprehensive charts and data visualization
- Weight progress over time
- Nutritional breakdown
- Goal progress tracking

### Admin Panel
- User management and administration
- System statistics
- User role management
- Data management

### Additional Features
- Water intake tracker
- BMI calculator
- Responsive design for mobile and desktop
- Dark mode support

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT-based auth with bcrypt
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account (free tier available at mongodb.com)
- Environment variables configured

### Environment Variables

You need to set the following environment variables in `.env.local`:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthtrack?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Environment
NODE_ENV=development
```

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
pnpm install
```

3. Create a MongoDB Atlas account:
   - Visit https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Create a database user with credentials
   - Get your connection string
   - Replace username and password in the connection string

4. Create `.env.local` file in the root directory and add your MongoDB URI and JWT_SECRET

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/              # API routes (auth, profile, diet-plans, progress, meals, admin)
│   ├── dashboard/        # Protected dashboard routes
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   ├── page.tsx         # Landing page
│   └── layout.tsx       # Root layout
├── components/
│   ├── bmi-calculator.tsx       # BMI calculator component
│   ├── diet-plan-form.tsx       # Create diet plans
│   ├── header.tsx               # Header navigation
│   ├── nutrition-info.tsx       # Nutrition display
│   ├── progress-entry-form.tsx  # Log progress
│   ├── sidebar.tsx              # Dashboard sidebar
│   ├── water-tracker.tsx        # Water intake tracker
│   ├── weight-chart.tsx         # Weight progress chart
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── utils.ts         # Utility functions
├── hooks/
│   └── use-auth.ts      # Authentication hook
├── scripts/
│   └── init-db.sql      # Database schema
└── public/              # Static files
```

## Database Schema

The application uses MongoDB with the following collections:

### Users Collection
```typescript
{
  _id: ObjectId
  email: string (unique)
  password: string (hashed)
  name: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### UserProfiles Collection
```typescript
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  currentWeight: number
  goalWeight: number
  activityLevel: string
  dietaryPreferences: [string]
  allergies: [string]
  medicalConditions: [string]
  createdAt: Date
  updatedAt: Date
}
```

### DietPlans Collection
```typescript
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  name: string
  type: 'balanced' | 'highProtein' | 'lowCarb' | 'keto' | 'vegan'
  description: string
  dailyCalories: number
  macros: { protein: number, carbs: number, fat: number }
  meals: [{ name, calories, protein, carbs, fat, time }]
  isActive: boolean
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}
```

### Meals Collection
```typescript
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  dietPlanId: ObjectId (reference to DietPlan)
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: [string]
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  date: Date
  createdAt: Date
  updatedAt: Date
}
```

### ProgressEntry Collection
```typescript
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  weight: number
  measurements: {
    chest: number
    waist: number
    hips: number
    thigh: number
    arm: number
  }
  notes: string
  photoUrl: string
  createdAt: Date
  updatedAt: Date
}
```

### WaterIntake Collection
```typescript
{
  _id: ObjectId
  userId: ObjectId (reference to User)
  amount: number
  date: Date
  createdAt: Date
  updatedAt: Date
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/profile` - Get user info and profile (returns `{ user, profile }`)
- `POST /api/profile` - Create/update profile

### Diet Plans
- `GET /api/diet-plans` - List user's diet plans
- `POST /api/diet-plans` - Create new diet plan

### Meals
- `GET /api/meals` - List meals
- `POST /api/meals` - Add meal
- `DELETE /api/meals` - Delete meal

### Progress
- `GET /api/progress` - Get progress entries
- `POST /api/progress` - Log new progress

### Admin
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - Update user
- `DELETE /api/admin/users` - Delete user

## Usage Examples

### Creating a Diet Plan
1. Navigate to "Diet Plans" section
2. Click "Create New Plan"
3. Enter plan details (name, type, daily calories)
4. Auto-calculate macros or set manually
5. Save the plan

### Logging Progress
1. Go to "Progress" section
2. Click "Log Your Progress"
3. Enter current weight (required)
4. Optional: Add body measurements
5. Add notes about your journey
6. Save the entry

### Viewing Analytics
1. Navigate to "Analytics"
2. View weight progress chart
3. See nutritional breakdown
4. Track goal progress

## Security Features

- **Password Security**: Bcrypt hashing for all user passwords
- **Session Management**: JWT tokens with secure cookie storage
- **Protected Routes**: All dashboard routes require authentication
- **Admin Control**: Role-based access control for admin features
- **Database Security**: Parameterized queries prevent SQL injection

## Deployment

### Deploy to Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. In Vercel project settings, add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random secret key
3. Deploy with a single click
4. Your MongoDB database will be accessible from Vercel

### MongoDB Atlas Setup for Production

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a production cluster
3. In Network Access, add Vercel's IP ranges (or allow all for development)
4. Create a database user with appropriate permissions
5. Use the connection string in `MONGODB_URI` environment variable

**Note**: For production, whitelist specific IP addresses instead of allowing all traffic.

## Performance Optimizations

- Server-side rendering with Next.js
- Static generation for landing page
- Image optimization
- Code splitting and lazy loading
- Database query optimization

## Future Enhancements

- Recipe recommendations powered by AI
- Social features and community challenges
- Integration with fitness trackers
- Mobile app using React Native
- Advanced analytics and predictions
- Meal prep planning
- Grocery list generation
- Personal trainer features

## Support

For issues or questions, please open an issue in the project repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# dite-planer
