import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import DietPlan from '@/lib/models/DietPlan';
import Meal from '@/lib/models/Meal';
import ProgressEntry from '@/lib/models/ProgressEntry';
import UserProfile from '@/lib/models/UserProfile';
import { getSession } from '@/lib/auth';

async function isAdmin(userId: string) {
  const user = await User.findById(userId);
  return user && user.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || !(await isAdmin(session.userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return NextResponse.json({
      users,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || !(await isAdmin(session.userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await User.findByIdAndUpdate(userId, { role });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || !(await isAdmin(session.userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (userId === session.userId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // Delete related data first
    const dietPlans = await DietPlan.find({ userId });
    const dietPlanIds = dietPlans.map((dp) => dp._id);
    
    await Meal.deleteMany({ dietPlanId: { $in: dietPlanIds } });
    await DietPlan.deleteMany({ userId });
    await ProgressEntry.deleteMany({ userId });
    await UserProfile.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
