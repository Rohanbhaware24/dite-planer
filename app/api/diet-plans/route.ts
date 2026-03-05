import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DietPlan from '@/lib/models/DietPlan';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await DietPlan.find({ userId: session.userId }).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Get diet plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planData = await request.json();
    const plan = await DietPlan.create({
      userId: session.userId,
      ...planData,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error('Create diet plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
