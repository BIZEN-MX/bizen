import { NextRequest, NextResponse } from 'next/server';
import { sendBizenWelcomeEmail } from '@/lib/emails/welcome-email';

export async function POST(request: NextRequest) {
  try {
    const { email, name, dashboardUrl } = await request.json();

    // Validate required fields
    if (!email || !name || !dashboardUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, dashboardUrl' },
        { status: 400 }
      );
    }

    // Send the welcome email
    const result = await sendBizenWelcomeEmail(email, name, dashboardUrl);

    if (result.error) {
      console.error('Resend API error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send welcome email', details: result.error },
        { status: 500 }
      );
    }

    console.log('Welcome email sent successfully:', {
      email,
      emailId: result.data?.id
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: result.data?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

