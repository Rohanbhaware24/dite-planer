import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProgressEntry from '@/lib/models/ProgressEntry';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = await ProgressEntry.find({ userId: session.userId }).sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Get progress error:', error);
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

    const recordData = await request.json();
    const record = await ProgressEntry.create({
      userId: session.userId,
      ...recordData,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Create progress record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
