import { sql } from '@vercel/postgres';

export async function getUser(email: string) {
  try {
    const result = await sql`
      SELECT id, email, password, role, created_at FROM users WHERE email = ${email}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT id, email, role, created_at FROM users WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function createUser(email: string, hashedPassword: string, role: string = 'user') {
  try {
    const result = await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${hashedPassword}, ${role})
      RETURNING id, email, role, created_at
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function createOrUpdateProfile(userId: string, profileData: any) {
  try {
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      const result = await sql`
        UPDATE user_profiles
        SET name = ${profileData.name},
            age = ${profileData.age},
            gender = ${profileData.gender},
            height_cm = ${profileData.height_cm},
            current_weight_kg = ${profileData.current_weight_kg},
            target_weight_kg = ${profileData.target_weight_kg},
            activity_level = ${profileData.activity_level},
            dietary_preferences = ${profileData.dietary_preferences},
            health_conditions = ${profileData.health_conditions},
            updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `;
      return result.rows[0];
    } else {
      const result = await sql`
        INSERT INTO user_profiles (user_id, name, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, dietary_preferences, health_conditions)
        VALUES (${userId}, ${profileData.name}, ${profileData.age}, ${profileData.gender}, ${profileData.height_cm}, ${profileData.current_weight_kg}, ${profileData.target_weight_kg}, ${profileData.activity_level}, ${profileData.dietary_preferences}, ${profileData.health_conditions})
        RETURNING *
      `;
      return result.rows[0];
    }
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getDietPlans(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM diet_plans WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function createDietPlan(userId: string, planData: any) {
  try {
    const result = await sql`
      INSERT INTO diet_plans (user_id, name, description, daily_calories, macros, meal_count, duration_days, type)
      VALUES (${userId}, ${planData.name}, ${planData.description}, ${planData.daily_calories}, ${JSON.stringify(planData.macros)}, ${planData.meal_count}, ${planData.duration_days}, ${planData.type})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getMeals(dietPlanId: string) {
  try {
    const result = await sql`
      SELECT * FROM meals WHERE diet_plan_id = ${dietPlanId} ORDER BY meal_time
    `;
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getProgressRecords(userId: string, limit: number = 30) {
  try {
    const result = await sql`
      SELECT * FROM progress_records WHERE user_id = ${userId} ORDER BY recorded_date DESC LIMIT ${limit}
    `;
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function createProgressRecord(userId: string, recordData: any) {
  try {
    const result = await sql`
      INSERT INTO progress_records (user_id, weight_kg, body_fat_percentage, measurements, notes, recorded_date)
      VALUES (${userId}, ${recordData.weight_kg}, ${recordData.body_fat_percentage}, ${JSON.stringify(recordData.measurements)}, ${recordData.notes}, ${recordData.recorded_date || new Date().toISOString().split('T')[0]})
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}
