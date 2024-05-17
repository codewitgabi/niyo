import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [1, "title cannot be less than 1"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [3, "description cannot be less than 3 characters"],
      maxLength: [255, "description cannot be more than 3 characters"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Task", TaskSchema);
