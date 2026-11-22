import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "User doesn't exist" }, { status: 404 });
    }

    return Response.json(
      {
        User: {
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

