import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {
  BadRequestError,
  PermissionDeniedError,
} from "../utils/error.handler.js";
config();

export const authenticate = (req, res, next) => {
  const cookies = req.cookies;

  if (!Object.keys(cookies).includes("Niyo-X-AccessToken")) {
    throw new PermissionDeniedError(
      "Authentication credentials were not provided"
    );
  }

  const token = cookies["Niyo-X-AccessToken"];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new BadRequestError(err);
    }

    req.user = decoded;
    next();
  });
};
