// app/api/user/practice-settings/route.ts
// UPDATED VERSION WITH ZOD VALIDATION

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProgressCollection } from '@/lib/mongodb';
import { updatePracticeSettingsSchema, validateData } from '@/lib/schemas';

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
    
    // ✅ VALIDATE WITH ZOD
    const validation = validateData(updatePracticeSettingsSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error },
        { status: 400 }
      );
    }

    const { 
      dailyGoalMinutes, 
      reminderEnabled, 
      reminderTime,
      pronunciationFocus 
    } = validation.data;

    const userProgressCollection = await getUserProgressCollection();

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (dailyGoalMinutes !== undefined) {
      updateFields['settings.practiceSettings.dailyGoalMinutes'] = dailyGoalMinutes;
      updateFields['dailyGoal'] = dailyGoalMinutes;
    }

    if (reminderEnabled !== undefined) {
      updateFields['settings.practiceSettings.reminderEnabled'] = reminderEnabled;
    }

    if (reminderTime) {
      updateFields['settings.practiceSettings.reminderTime'] = reminderTime;
    }

    if (pronunciationFocus) {
      updateFields['settings.practiceSettings.pronunciationFocus'] = pronunciationFocus;
    }

    await userProgressCollection.updateOne(
      { userId },
      { $set: updateFields },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Practice settings updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating practice settings:', error);
    return NextResponse.json(
      { error: 'Failed to update practice settings', details: error.message },
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
      dailyGoalMinutes: 10,
      reminderEnabled: true,
      reminderTime: "18:00",
      pronunciationFocus: {
        rVsL: true,
        thSounds: true,
        wordStress: false,
        silentVowels: false,
      },
    };

    if (!userProgress?.settings?.practiceSettings) {
      return NextResponse.json({
        success: true,
        settings: defaultSettings,
      });
    }

    return NextResponse.json({
      success: true,
      settings: userProgress.settings.practiceSettings,
    });

  } catch (error: any) {
    console.error('Error fetching practice settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practice settings', details: error.message },
      { status: 500 }
    );
  }
}