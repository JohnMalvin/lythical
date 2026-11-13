
import { connectDB } from "@/lib/mongodb";
import { Result } from "@/lib/interface";
import User, { IPublicUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { SignUpZod, signUpZod } from "@/lib/zod";
import { config } from "@/lib/config";
import VerificationCode from "@/models/VerificationCode";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = signUpZod.safeParse(body);

        if (!validation.success) {
            return Response.json(
                {
                    error: Object.values(validation.error.flatten().fieldErrors).flat()[0]
                },
                { status: 400 }
            );
        }

        const result = await handleSignUp(validation.data);

        if (!result.success) {
            return Response.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return Response.json(
            {
                message: "Account created successfully",
                user: result.data
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Sign up error:", error);

        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

async function handleSignUp(data: SignUpZod): Promise<Result<IPublicUser>> {
    await connectDB();

    const session = await mongoose.startSession();

    const email = data.email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    let result: Result<IPublicUser> = {
        success: false,
        error: "Signup failed"
    };

    try {
        await session.withTransaction(async () => {
            const existingUser = await User.findOne({
                $or: [
                    { username: data.username },
                    { email }
                ]
            }).session(session).lean();

            if (existingUser) {
                result = {
                    success: false,
                    error: "Username or email already exists"
                };
                return;
            }

            const verification = await VerificationCode.findOneAndDelete({
                email,
                verified: true,
                expiresAt: { $gt: new Date() }
            }).session(session);

            if (!verification) {
                result = {
                    success: false,
                    error: "Email has not been verified"
                };
                return;
            }

            const [user] = await User.create([{
                username: data.username,
                email,
                password: hashedPassword
            }], { session });

            result = {
                success: true,
                data: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email
                }
            };
        });

        return result;

    } finally {
        await session.endSession();
    }
}
