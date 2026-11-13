
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationCode from "@/models/VerificationCode";
import { verificationCodeZod } from "@/lib/zod";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const result = verificationCodeZod.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or verification code.",
                },
                { status: 400 }
            );
        }

        const { email, code } = result.data;

        const verification = await VerificationCode.findOne({
            email: email.trim().toLowerCase(),
            code,
            expiresAt: { $gt: new Date() },
            verified: false,
        });

        if (!verification) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired verification code.",
                },
                { status: 400 }
            );
        }

        const updateResult = await VerificationCode.updateOne(
            {
                _id: verification._id,
                verified: false,
                expiresAt: { $gt: new Date() },
            },
            {
                $set: { verified: true },
            }
        );

        if (updateResult.modifiedCount !== 1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification failed. Please try again.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Email verified successfully.",
        });
    } catch (error) {
        console.error("Verification error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}
