import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import UserProfile from '@/lib/models/UserProfile';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.userId);
    const profile = await UserProfile.findOne({ userId: session.userId });

    return NextResponse.json({
      user,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();
    
    let profile = await UserProfile.findOne({ userId: session.userId });
    
    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = await UserProfile.create({
        userId: session.userId,
        ...profileData,
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
