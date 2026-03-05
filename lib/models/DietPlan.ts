import mongoose from "mongoose";

const DietPlanSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  dailyCalories: {
    type: Number,
    default: 2000
  },

  meals: [
    {
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.DietPlan ||
  mongoose.model("DietPlan", DietPlanSchema);