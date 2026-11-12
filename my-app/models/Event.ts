import mongoose, { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["button_click"],
    required: true,
  },
  elementName: {
    type: String,
    default: null,
  },
  elementGroup: {
    type: String,
    default: null,
  },
  elementLocation: {
    type: String,
    default: null,
  },
  page: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})
const Event = model("Event", eventSchema)
export default Event