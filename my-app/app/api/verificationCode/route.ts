import { NextResponse } from "next/server";
import transporter from "@/lib/mailer";
import { generateVerificationCode } from "@/lib/helperFunctions";
import VerificationCode from "@/models/VerificationCode";
import { emailZod, verificationCodeZod } from "@/lib/zod";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const result = emailZod.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email address.",
                },
                { status: 400 }
            );
        }

        const { email } = result.data;

        const emailSent = await handleVerificationCode(email);

        if (!emailSent) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to send verification email.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Verification code sent successfully.",
        });
    } catch (error) {
        console.error("Verification email error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}

async function handleVerificationCode(emailAddress: string) {
    const vCode = await createVerificationCode(emailAddress);
    const code = vCode.code;

    try {
        const info = await transporter.sendMail({
            from: `"Lythical" <${process.env.SMTP_USER}>`,
            to: emailAddress,
            subject: `${code} is your Lythical verification code`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify your email - Lythical</title>
                </head>
                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #0b0b10;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #ffffff;
                ">
                    <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="background-color: #0b0b10; padding: 48px 16px;"
                    >
                        <tr>
                            <td align="center">
                                <table
                                    role="presentation"
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                    style="
                                        max-width: 520px;
                                        background-color: #14141c;
                                        border: 1px solid #292936;
                                        border-radius: 16px;
                                        overflow: hidden;
                                    "
                                >
                                    <!-- Header -->
                                    <tr>
                                        <td style="
                                            padding: 36px 40px 24px;
                                            text-align: center;
                                        ">
                                        <img
                                            src="${process.env.NEXT_PUBLIC_APP_URL}/file.svg"
                                            alt="Lythical Logo"
                                            width="48"
                                            height="48"
                                            style="
                                                display: block;
                                                margin: 0 auto 12px;
                                                width: 48px;
                                                height: 48px;
                                            "
                                        >
                                            <p style="
                                                margin: 10px 0 0;
                                                color: #888899;
                                                font-size: 12px;
                                                letter-spacing: 3px;
                                                text-transform: uppercase;
                                            ">
                                                Welcome to something new
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Divider -->
                                    <tr>
                                        <td style="padding: 0 40px;">
                                            <div style="
                                                height: 1px;
                                                background-color: #292936;
                                            "></div>
                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="
                                            padding: 40px 40px 20px;
                                        ">
                                            <h2 style="
                                                margin: 0 0 16px;
                                                color: #ffffff;
                                                font-size: 25px;
                                                font-weight: 700;
                                                line-height: 1.4;
                                            ">
                                                Verify your email address
                                            </h2>

                                            <p style="
                                                margin: 0;
                                                color: #a1a1b2;
                                                font-size: 15px;
                                                line-height: 1.8;
                                            ">
                                                Thanks for joining Lythical! We're excited
                                                to have you here. To complete your
                                                registration, please use the verification
                                                code below.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Verification Code -->
                                    <tr>
                                        <td style="
                                            padding: 24px 40px;
                                        ">
                                            <div style="
                                                padding: 28px 16px;
                                                background-color: #1d1b2b;
                                                border: 1px solid #44366d;
                                                border-radius: 12px;
                                                text-align: center;
                                            ">
                                                <p style="
                                                    margin: 0 0 14px;
                                                    color: #9cec00;
                                                    font-size: 11px;
                                                    font-weight: 700;
                                                    letter-spacing: 2px;
                                                    text-transform: uppercase;
                                                ">
                                                    Your verification code
                                                </p>

                                                <h1 style="
                                                    margin: 0;
                                                    color: #ffffff;
                                                    font-size: 38px;
                                                    font-weight: 800;
                                                    letter-spacing: 10px;
                                                ">
                                                    ${code}
                                                </h1>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Expiration Notice -->
                                    <tr>
                                        <td style="
                                            padding: 8px 40px 32px;
                                        ">
                                            <p style="
                                                margin: 0;
                                                color: #a1a1b2;
                                                font-size: 13px;
                                                line-height: 1.8;
                                                text-align: center;
                                            ">
                                                This code will expire in
                                                <strong style="color: #ffffff;">
                                                    05 minutes
                                                </strong>.
                                                Please do not share it with anyone.
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Security Notice -->
                                    <tr>
                                        <td style="
                                            padding: 24px 40px;
                                            background-color: #101017;
                                            border-top: 1px solid #292936;
                                        ">
                                            <p style="
                                                margin: 0 0 8px;
                                                color: #ffffff;
                                                font-size: 13px;
                                                font-weight: 700;
                                            ">
                                                Didn't request this code?
                                            </p>

                                            <p style="
                                                margin: 0;
                                                color: #888899;
                                                font-size: 12px;
                                                line-height: 1.7;
                                            ">
                                                You can safely ignore this email.
                                                Someone may have entered your email
                                                address by mistake.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Footer -->
                                <table
                                    role="presentation"
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    border="0"
                                    style="max-width: 520px;"
                                >
                                    <tr>
                                        <td style="
                                            padding: 28px 20px;
                                            text-align: center;
                                        ">
                                            <p style="
                                                margin: 0 0 8px;
                                                color: #666675;
                                                font-size: 12px;
                                            ">
                                                © ${new Date().getFullYear()} Lythical. All rights reserved.
                                            </p>

                                            <p style="
                                                margin: 0;
                                                color: #555563;
                                                font-size: 11px;
                                            ">
                                                This is an automated message. Please do not reply.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        console.log("Verification email sent:", info.messageId);

        return true;
    } catch (error) {
        console.error("Failed to send verification email:", error);
        return false;
    }
}


async function createVerificationCode(email: string) {
    const code = generateVerificationCode();

    const vCode = await VerificationCode.findOneAndUpdate(
        { email },
        {
            $set: {
                code,
                verified: false,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        },
        {
            upsert: true,
            new: true,
            runValidators: true,
        }
    );

    return vCode;
}
