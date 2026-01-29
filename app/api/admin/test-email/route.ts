
import { NextResponse } from 'next/server';
import { sendBadgeEmail } from '@/lib/email'; // Adjust import path if needed

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Please provide an email query param: ?email=yourname@example.com' }, { status: 400 });
    }

    try {
        console.log(`Attempting to send test email to ${email}...`);
        const info = await sendBadgeEmail(
            email,
            "Test Badge 🚀",
            "This is a test badge to verify the email system is working correctly.",
            "Test User"
        );

        return NextResponse.json({
            success: true,
            message: 'Email sent (check server logs for details)',
            info
        });
    } catch (error: any) {
        console.error("Test email failed:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
