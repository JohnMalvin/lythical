import mongoose, { Schema, model, models } from "mongoose";

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectKey: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
})
const Project = model("Project", projectSchema)
export default Project