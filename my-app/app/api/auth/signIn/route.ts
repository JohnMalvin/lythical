
import { connectDB } from "@/lib/mongodb";
import { Result } from "@/lib/interface";
import User, { IPublicUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { SignInZod, signInZod } from "@/lib/zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = signInZod.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          error: Object.values(validation.error.flatten().fieldErrors).flat()[0]
        },
        { status: 400 }
      );
    }

    const result = await handleSignIn(validation.data);

    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return Response.json(
      {
        message: "Sign in successful",
        user: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Sign in error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSignIn(data: SignInZod): Promise<Result<IPublicUser>> {
  await connectDB();

  const user = await User.findOne({
    $or: [
      { username: data.usernameEmail },
      { email: data.usernameEmail }
    ]
  }).select("+password").lean();

  if (!user) {
    return {
      success: false,
      error: "Invalid credentials"
    };
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    return {
      success: false,
      error: "Invalid credentials"
    };
  }

  return {
    success: true,
    data: {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    }
  };
}
