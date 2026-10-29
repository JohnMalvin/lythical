import mongoose from "mongoose";

export async function connectdb() {
  const MONGOOSE_URI = process.env.URI

  if (!MONGOOSE_URI) {
    throw new Error("Missing URI");
  }

  await mongoose.connect(MONGOOSE_URI)
}

