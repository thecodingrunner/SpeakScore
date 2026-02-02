// app/api/user/profile/route.ts
// Update user profile information

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection } from '@/lib/mongodb';

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, avatarUrl } = body;

    const userProgressCollection = await getUserProgressCollection();

    // Update user profile settings
    const result = await userProgressCollection.updateOne(
      { userId },
      {
        $set: {
          'settings.displayName': displayName,
          'settings.avatarUrl': avatarUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userProgressCollection = await getUserProgressCollection();
    const userProgress = await userProgressCollection.findOne({ userId });

    if (!userProgress) {
      return NextResponse.json({
        success: true,
        settings: {
          displayName: null,
          avatarUrl: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        displayName: userProgress.settings?.displayName || null,
        avatarUrl: userProgress.settings?.avatarUrl || null,
      },
    });

  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}