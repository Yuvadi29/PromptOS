import nodemailer from 'nodemailer';

const authConfig = process.env.GOOGLE_REFRESH_TOKEN
    ? {
        type: "OAuth2" as const,
        user: "promptos001@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
    : {
        user: process.env.EMAIL_SERVER_USER || "promptos001@gmail.com",
        pass: process.env.EMAIL_SERVER_PASSWORD,
    };

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: authConfig,
});

export async function sendBadgeEmail(toEmail: string, badgeName: string, badgeDescription: string, userName: string) {
    // If no refresh token AND no explicit host, use mock
    // if (!process.env.GOOGLE_REFRESH_TOKEN && !process.env.EMAIL_SERVER_HOST) {
    //     console.log(`[Mock Email] To: ${toEmail} | Subject: New Badge Unlocked: ${badgeName}`);
    //     return;
    // }

    try {
        const info = await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER || '"PromptOS" <promptos001@gmail.com>',
            to: toEmail,
            subject: `🏆 Badge Unlocked: ${badgeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #f97316; text-align: center;">Congratulations, ${userName}!</h1>
                    <p style="text-align: center; font-size: 18px; color: #333;">You've just unlocked a new badge on PromptOS.</p>
                    
                    <div style="background-color: #fff7ed; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 1px solid #fed7aa;">
                        <h2 style="margin: 0; color: #9a3412;">${badgeName}</h2>
                        <p style="color: #ea580c;">${badgeDescription}</p>
                    </div>

                    <p style="text-align: center; color: #666;">Keep exploring and mastering prompt engineering!</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.NEXTAUTH_URL}/profile" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Profile</a>
                    </div>
                </div>
            `,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
