// app/api/user/notifications/route.ts
// Update user notification preferences

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
    const { 
      progressUpdates, 
      achievementAlerts, 
      newFeatures,
      emailNotifications 
    } = body;

    const userProgressCollection = await getUserProgressCollection();

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (progressUpdates !== undefined) {
      updateFields['settings.notifications.progressUpdates'] = progressUpdates;
    }

    if (achievementAlerts !== undefined) {
      updateFields['settings.notifications.achievementAlerts'] = achievementAlerts;
    }

    if (newFeatures !== undefined) {
      updateFields['settings.notifications.newFeatures'] = newFeatures;
    }

    if (emailNotifications !== undefined) {
      updateFields['settings.notifications.emailNotifications'] = emailNotifications;
    }

    await userProgressCollection.updateOne(
      { userId },
      { $set: updateFields },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences', details: error.message },
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

    // Default settings
    const defaultSettings = {
      progressUpdates: true,
      achievementAlerts: true,
      newFeatures: false,
      emailNotifications: true,
    };

    if (!userProgress?.settings?.notifications) {
      return NextResponse.json({
        success: true,
        settings: defaultSettings,
      });
    }

    return NextResponse.json({
      success: true,
      settings: userProgress.settings.notifications,
    });

  } catch (error: any) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences', details: error.message },
      { status: 500 }
    );
  }
}