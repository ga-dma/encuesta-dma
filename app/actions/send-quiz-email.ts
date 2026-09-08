"use server";

import { Resend } from "resend";

export type QuizEmailData = {
    maturityTitle: string;
    score: string;
    category: string;
    description: string;
    suggestion: string;
};

const INTERNAL_RECIPIENTS = [
    "alvaro@dmaanalytics.com",
    "samuel@dmaanalytics.com",
];

function buildClientEmailHtml(resultsData: QuizEmailData) {
    return `
        <div style="background-color: #1a2e2a; background-image: url('https://www.dmaanalytics.com/assets/footer-bg.png'); background-size: cover; background-position: center; background-repeat: no-repeat; padding: 60px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f8f6f0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1a2e2a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
                <!-- Header -->
                <div style="background-color: #152522; padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <img src="https://www.dmaanalytics.com/icons/dma-logo-white.svg" alt="DMA Logo" height="100" width="100" style="display: block; margin: 0 auto; border: 0;" />
                </div>
                
                <!-- Body -->
                <div style="padding: 40px 30px; color: #f8f6f0;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: rgba(255,255,255,0.9);">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px; color: rgba(255,255,255,0.9);">Thank you for completing the <b style="color: #ffffff;">Data Maturity Assessment</b>. Here are the results for your organization's <b style="color: #ffffff;">${resultsData.category}</b> focus area.</p>
                    
                    <!-- Result Card -->
                    <div style="background-color: rgba(255,255,255,0.03); border-left: 4px solid #0FFF7A; padding: 24px; border-radius: 8px; margin-bottom: 32px; border-top: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span style="text-transform: uppercase; font-size: 12px; font-weight: bold; color: #0FFF7A; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Your Assessment Result</span>
                        <h2 style="font-size: 28px; margin: 0 0 12px 0; color: #ffffff;">${resultsData.maturityTitle}</h2>
                        <div style="font-size: 18px; color: rgba(255,255,255,0.7);">
                            <b style="color: #ffffff;">Score:</b> ${resultsData.score} / 5.0
                        </div>
                    </div>

                    <h3 style="font-size: 18px; color: #ffffff; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">What this means</h3>
                    <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-bottom: 24px;">${resultsData.description}</p>

                    <h3 style="font-size: 18px; color: #ffffff; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Recommended Next Step</h3>
                    <p style="font-size: 15px; line-height: 1.6; color: #ffffff; background-color: rgba(15, 255, 122, 0.05); padding: 15px; border-radius: 8px; margin-bottom: 32px; border: 1px solid rgba(15, 255, 122, 0.2);">
                        ${resultsData.suggestion}
                    </p>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="https://dmaanalytics.com#contact" style="background-color: #0FFF7A; color: #1a2e2a; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                            Schedule a Strategy Call
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #152522; padding: 24px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4);">&copy; 2026 DMA Research & Data Analytics. All rights reserved.</p>
                </div>
            </div>
        </div>
    `;
}

function buildInternalNotificationHtml(clientEmail: string, resultsData: QuizEmailData) {
    return `
        <div style="background-color: #1a2e2a; background-image: url('https://www.dmaanalytics.com/assets/footer-bg.png'); background-size: cover; background-position: center; background-repeat: no-repeat; padding: 60px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f8f6f0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1a2e2a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
                <!-- Header -->
                <div style="background-color: #152522; padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <img src="https://www.dmaanalytics.com/icons/dma-logo-white.svg" alt="DMA Logo" height="100" width="100" style="display: block; margin: 0 auto; border: 0;" />
                    <h1 style="margin: 20px 0 0 0; color: #0FFF7A; font-size: 20px; text-transform: uppercase; letter-spacing: 0.1em;">New Quiz Submission</h1>
                </div>
                
                <div style="padding: 40px 30px; color: #f8f6f0;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td style="padding: 15px 0; color: rgba(255,255,255,0.6); font-size: 14px; width: 140px;">Client Email:</td>
                            <td style="padding: 15px 0; color: #ffffff; font-weight: bold; font-size: 16px;">
                                <a href="mailto:${clientEmail}" style="color: #0FFF7A; text-decoration: none;">${clientEmail}</a>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td style="padding: 15px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Track:</td>
                            <td style="padding: 15px 0; color: #ffffff; font-size: 16px;">${resultsData.category}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td style="padding: 15px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Maturity Level:</td>
                            <td style="padding: 15px 0; color: #ffffff; font-size: 16px;">${resultsData.maturityTitle}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <td style="padding: 15px 0; color: rgba(255,255,255,0.6); font-size: 14px;">Score:</td>
                            <td style="padding: 15px 0; color: #0FFF7A; font-size: 18px; font-weight: bold;">${resultsData.score} / 5.0</td>
                        </tr>
                    </table>
                    
                    <div style="background-color: rgba(255,255,255,0.03); border-left: 4px solid #0FFF7A; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #0FFF7A;">Description Sent</h4>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.8);">${resultsData.description}</p>
                    </div>

                    <div style="background-color: rgba(255,255,255,0.03); border-left: 4px solid rgba(255,255,255,0.2); padding: 24px; border-radius: 8px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #ffffff;">Suggestion Sent</h4>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.8);">${resultsData.suggestion}</p>
                    </div>
                </div>
                
                <div style="background-color: #152522; padding: 24px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4);">Internal notification — DMA Analytics System</p>
                </div>
            </div>
        </div>
    `;
}

export async function sendQuizEmail(email: string, resultsData: QuizEmailData) {
    if (!process.env.RESEND_API_KEY) {
        return { error: "Missing Resend API Key in .env.local" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const [clientResult, internalResult] = await Promise.allSettled([
            resend.emails.send({
                from: "DMA Analytics <dma@updates.dmaanalytics.com>",
                to: [email],
                subject: "Your Data Maturity Assessment Results",
                html: buildClientEmailHtml(resultsData),
            }),
            resend.emails.send({
                from: "DMA Analytics <dma@updates.dmaanalytics.com>",
                to: INTERNAL_RECIPIENTS,
                subject: `📊 New Submission: ${resultsData.category} — ${email}`,
                html: buildInternalNotificationHtml(email, resultsData),
            }),
        ]);

        if (clientResult.status === "rejected") {
            return { error: "Failed to send email to client" };
        }

        const clientData = clientResult.value;
        if (clientData.error) {
            return { error: clientData.error.message };
        }

        if (internalResult.status === "rejected") {
            console.error("Failed to send internal notification:", internalResult.reason);
        } else if (internalResult.value.error) {
            console.error("Internal notification error:", internalResult.value.error);
        }

        return { success: true, data: clientData.data };
    } catch (err) {
        return { error: "Failed to send email" };
    }
}
