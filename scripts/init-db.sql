-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with health metrics
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  gender VARCHAR(20), -- 'male', 'female', 'other'
  height_cm DECIMAL(5, 2),
  current_weight_kg DECIMAL(6, 2),
  goal_weight_kg DECIMAL(6, 2),
  activity_level VARCHAR(50), -- 'sedentary', 'lightly_active', 'moderately_active', 'very_active'
  dietary_preferences TEXT, -- JSON array of preferences
  allergies TEXT, -- JSON array of allergies
  health_conditions TEXT, -- JSON array of conditions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition database
CREATE TABLE IF NOT EXISTS nutrition_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  serving_size VARCHAR(100),
  calories DECIMAL(6, 2),
  protein_g DECIMAL(6, 2),
  carbs_g DECIMAL(6, 2),
  fat_g DECIMAL(6, 2),
  fiber_g DECIMAL(6, 2),
  sugar_g DECIMAL(6, 2),
  category VARCHAR(100), -- 'protein', 'carbs', 'vegetables', 'fruits', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diet plans
CREATE TABLE IF NOT EXISTS diet_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(255),
  plan_type VARCHAR(100), -- 'balanced', 'low_carb', 'high_protein', 'vegetarian', etc.
  daily_calorie_target DECIMAL(6, 2),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily meals
CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  diet_plan_id INTEGER NOT NULL REFERENCES diet_plans(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'snack'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal items (individual food items in a meal)
CREATE TABLE IF NOT EXISTS meal_items (
  id SERIAL PRIMARY KEY,
  meal_id INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  nutrition_item_id INTEGER REFERENCES nutrition_items(id),
  quantity DECIMAL(6, 2),
  unit VARCHAR(50), -- 'g', 'ml', 'cup', 'tbsp', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking (daily logs)
CREATE TABLE IF NOT EXISTS progress_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight_kg DECIMAL(6, 2),
  water_intake_ml INTEGER,
  exercise_minutes INTEGER,
  exercise_type VARCHAR(100),
  mood VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BMI history
CREATE TABLE IF NOT EXISTS bmi_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bmi_value DECIMAL(5, 2),
  weight_kg DECIMAL(6, 2),
  height_cm DECIMAL(5, 2),
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255),
  target_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_meals_diet_plan_id ON meals(diet_plan_id);
CREATE INDEX idx_meals_meal_date ON meals(meal_date);
CREATE INDEX idx_meal_items_meal_id ON meal_items(meal_id);
CREATE INDEX idx_progress_logs_user_id ON progress_logs(user_id);
CREATE INDEX idx_progress_logs_date ON progress_logs(log_date);
CREATE INDEX idx_bmi_history_user_id ON bmi_history(user_id);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
