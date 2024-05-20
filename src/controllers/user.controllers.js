import "express-async-errors";
import { validationResult, matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
import { ApiError, BadRequestError } from "../utils/error.handler.js";
config();

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @route POST /api/auth/register
 * @access Public
 */
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
        .json({ data: user.toObject(), statusCode: StatusCodes.CREATED });
    }
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { email, password } = matchedData(req);

    // get user with provided credentials

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new BadRequestError("User with email does not exist");
    }

    if (!user.checkPassword(password)) {
      throw new BadRequestError("Password is incorrect");
    }

    // update user last login

    await User.findOneAndUpdate({ email }, { lastLogin: new Date() });

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

    const options = {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("Niyo-X-AccessToken", accessToken, options);

    res.status(StatusCodes.OK).json({
      data: {
        message: "Login successful",
      },
      statusCode: StatusCodes.OK,
    });
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("Niyo-X-AccessToken");

    res.status(StatusCodes.OK).json({
      data: {
        message: "Logout successful",
      },
      statusCode: StatusCodes.OK,
    });
  } catch (e) {
    throw new ApiError(e.message);
  }
};
