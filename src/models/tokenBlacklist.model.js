import { Schema, model } from "mongoose";

const TokenBlacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("TokenBlacklist", TokenBlacklistSchema);
