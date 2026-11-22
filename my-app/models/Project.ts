import { Schema, model } from "mongoose";

export interface IProject {
  owner: string;
  projectName: string;
  projectKey: string;
  description: string;
}
// Owner type previously Schema.Types.ObjectId
export type IPublicProject = {
  owner: string;
  projectName: string;
  description: string;
};

const projectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
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