import { NextRequest, NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';

/**
 * Generic email sending API route
 * 
 * This is a generic route for sending emails. For security,
 * you should add authentication/authorization checks here
 * to prevent unauthorized use.
 * 
 * For production, consider:
 * - Validating the user is authenticated
 * - Rate limiting this endpoint
 * - Whitelisting allowed email recipients
 */
export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from } = await request.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // TODO: Add authentication check here
    // Example:
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const resend = await getResend();
    const { data, error } = await resend.emails.send({
      from: from || 'BIZEN <onboarding@resend.dev>', // Change to your verified domain
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log('Email sent successfully:', {
      to,
      subject,
      emailId: data?.id
    });

    return NextResponse.json({ 
      success: true,
      data 
    }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

