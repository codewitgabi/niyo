import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {
  BadRequestError,
  PermissionDeniedError,
} from "../utils/error.handler.js";
config();

export const authenticate = (req, res, next) => {
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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new BadRequestError(err);
    }

    req.user = decoded;
    next();
  });
};
