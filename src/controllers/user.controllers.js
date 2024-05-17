import "express-async-errors";
import { validationResult, matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
import { BadRequestError } from "../utils/error.handler.js";
config();

export const register = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    } else {
      const { username, email, password } = matchedData(req);
      const user = new User({
        username,
        email,
        password,
      });

      await user.save();

      res
        .status(StatusCodes.CREATED)
        .json({ data: user, statusCode: StatusCodes.CREATED });
    }
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { email, password } = matchedData(req);

    // get user with provided credentials

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("User with email does not exist");
    }

    if (!user.checkPassword(password)) {
      throw new BadRequestError("Password is incorrect");
    }

    // generate access tokens
    const { username, lastLogin, _id } = user;

    const accessToken = jwt.sign(
      {
        username,
        email,
        lastLogin,
        _id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );

    // update user last login

    // user.lastLogin = new Date();
    // await user.save();

    res.status(StatusCodes.OK).json({
      data: {
        accessToken,
      },
      statusCode: StatusCodes.OK,
    });
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};
