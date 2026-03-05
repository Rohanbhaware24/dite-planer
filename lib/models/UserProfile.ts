// import mongoose from 'mongoose';

// const userProfileSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       unique: true,
//     },
//     age: {
//       type: Number,
//       required: true,
//     },
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other'],
//       required: true,
//     },
//     height: {
//       type: Number,
//       required: true,
//     },
//     currentWeight: {
//       type: Number,
//       required: true,
//     },
//     goalWeight: {
//       type: Number,
//       required: true,
//     },
//     activityLevel: {
//       type: String,
//       enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'],
//       required: true,
//     },
//     dietaryPreferences: [String],
//     allergies: [String],
//     medicalConditions: [String],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);


import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  height: {
    type: Number
  },

  currentWeight: {
    type: Number
  },

  goalWeight: {
    type: Number
  },

  activityLevel: {
    type: String
  }

});

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);