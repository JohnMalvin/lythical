import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const {email, password, firstName, lastName}= await request.json();

    if (!email || !password || !firstName || !lastName) {
      return Response.json({error: "request body"});
    }

    const userExists = await User.findOne({email: email})
    if (userExists) {
      return Response.json({error: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user =  await User.create({
      email,
      hashedPassword,
      firstName,
      lastName,
    })

    return Response.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 200 }
    );

  } catch {
    return Response.json({error: "request failed"}, { status: 200 });
  }
}

