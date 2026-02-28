// app/api/user/language/route.ts
// Update user language, voice gender, and region preferences

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
    const { interfaceLanguage, practiceVoiceAccent, practiceVoiceGender } = body;

    // Validation
    const validLanguages = ['en', 'ja'];
    const validAccents = ['american', 'british'];
    const validGenders = ['female', 'male'];

    if (interfaceLanguage && !validLanguages.includes(interfaceLanguage)) {
      return NextResponse.json(
        { error: 'Invalid interface language' },
        { status: 400 }
      );
    }

    if (practiceVoiceAccent && !validAccents.includes(practiceVoiceAccent)) {
      return NextResponse.json(
        { error: 'Invalid voice accent' },
        { status: 400 }
      );
    }

    if (practiceVoiceGender && !validGenders.includes(practiceVoiceGender)) {
      return NextResponse.json(
        { error: 'Invalid voice gender' },
        { status: 400 }
      );
    }

    const userProgressCollection = await getUserProgressCollection();

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (interfaceLanguage) {
      updateFields['settings.language.interfaceLanguage'] = interfaceLanguage;
    }

    if (practiceVoiceAccent) {
      updateFields['settings.language.practiceVoiceAccent'] = practiceVoiceAccent;
    }

    if (practiceVoiceGender) {
      updateFields['settings.language.practiceVoiceGender'] = practiceVoiceGender;
    }

    await userProgressCollection.updateOne(
      { userId },
      { $set: updateFields },
      { upsert: true }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Language preferences updated successfully',
    });

    // Keep the NEXT_LOCALE cookie in sync so next-intl picks up the change
    if (interfaceLanguage) {
      response.cookies.set('NEXT_LOCALE', interfaceLanguage, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }

    return response;

  } catch (error: any) {
    console.error('Error updating language preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update language preferences', details: error.message },
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
      interfaceLanguage: 'en',
      practiceVoiceAccent: 'american',
      practiceVoiceGender: 'female',
    };

    if (!userProgress?.settings?.language) {
      return NextResponse.json({
        success: true,
        settings: defaultSettings,
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...defaultSettings,
        ...userProgress.settings.language,
      },
    });

  } catch (error: any) {
    console.error('Error fetching language preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch language preferences', details: error.message },
      { status: 500 }
    );
  }
}