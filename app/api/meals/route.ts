import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Meal from '@/lib/models/Meal';
import DietPlan from '@/lib/models/DietPlan';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dietPlanId = searchParams.get('dietPlanId');

    let meals;
    if (dietPlanId) {
      meals = await Meal.find({ dietPlanId }).sort({ mealTime: 1 });
    } else {
      meals = await Meal.find({ userId: session.userId }).sort({ date: -1 });
    }

    return NextResponse.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dietPlanId, ...mealData } = body;

    // Validate that the diet plan belongs to the user if provided
    if (dietPlanId) {
      const dietPlan = await DietPlan.findOne({
        _id: dietPlanId,
        userId: session.userId,
      });

      if (!dietPlan) {
        return NextResponse.json({ error: 'Diet plan not found' }, { status: 404 });
      }
    }

    const meal = await Meal.create({
      userId: session.userId,
      dietPlanId,
      ...mealData,
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mealId = searchParams.get('id');

    if (!mealId) {
      return NextResponse.json({ error: 'Meal ID required' }, { status: 400 });
    }

    const meal = await Meal.findOneAndDelete({
      _id: mealId,
      userId: session.userId,
    });

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
