import { StatusCodes } from "http-status-codes";
import { ApiError } from "./error.handler.js";

export const IsAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(
      "Authentication credentials were not provided",
      StatusCodes.UNAUTHORIZED
    );
  }
  next();
};

/**
 * @param {request} req
 * @param {object} objUserId
 * @returns {boolean} true if the request user is the obj owner else false
 */
export const isOwner = (req, objUserId) => {
  return req?.user?._id === objUserId.toString();
};
