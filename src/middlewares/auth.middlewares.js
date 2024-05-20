import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {
  BadRequestError,
  PermissionDeniedError,
} from "../utils/error.handler.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
config();

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new PermissionDeniedError(
      "Authentication credentials were not provided"
    );
  }

  const [bearer, token] = authorization.split(" ");

  if (!bearer || !token || bearer !== "Bearer") {
    throw new BadRequestError(
      "Authentication credentials were not properly formed"
    );
  }

  // check if token is blacklisted

  const isBlacklisted = await TokenBlacklist.findOne({ token });

  if (isBlacklisted) {
    throw new BadRequestError("Invalid credential. Token is no longer valid");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new BadRequestError(err);
    }

    req.user = decoded;
    next();
  });
};
