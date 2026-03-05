import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dietPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DietPlan',
    },
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: Number,
    carbs: Number,
    fat: Number,
    ingredients: [String],
    mealTime: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Meal || mongoose.model('Meal', mealSchema);
