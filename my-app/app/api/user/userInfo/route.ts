import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const body = await request.json();
    if ()

    return Response.json({ status: 200 });
  } catch (error) {
    return Response.json({ error: "Dude doesn't exist" }, { status: 400 });
  }
}
