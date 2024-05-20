import "express-async-errors";
import { matchedData, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Task from "../models/task.model.js";
import {
  ApiError,
  BadRequestError,
  PermissionDeniedError,
} from "../utils/error.handler.js";
import { isOwner } from "../utils/permissions.js";

export const createTask = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { title, description } = matchedData(req);

    const task = await Task.create({ title, description, owner: req.user._id });

    res
      .status(StatusCodes.CREATED)
      .json({ data: task, statusCode: StatusCodes.CREATED });
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });

    res
      .status(StatusCodes.OK)
      .json({ data: tasks, statusCode: StatusCodes.OK });
  } catch (e) {
    throw new ApiError(e.message);
  }
};

export const getTask = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { taskId } = matchedData(req);
    const task = await Task.findOne({
      _id: taskId,
      owner: req.user._id,
    });

    if (!task) {
      throw new ApiError(
        "Task not found or you are not allowed to view this task"
      );
    }

    res.status(StatusCodes.OK).json({ data: task, statusCode: StatusCodes.OK });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      throw new BadRequestError("taskId is not a valid ObjectId");
    }

    throw new BadRequestError(e.message);
  }
};

export const updateTask = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { taskId, title, description } = matchedData(req);
    const task = await Task.findById(taskId);

    if (!isOwner(req, task.owner)) {
      throw new PermissionDeniedError();
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title || task.title,
        description: description || task.description,
      },
      { new: true }
    );

    res
      .status(StatusCodes.OK)
      .json({ data: updatedTask, statusCode: StatusCodes.OK });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      throw new BadRequestError("taskId is not a valid ObjectId");
    }

    throw new ApiError(e.message, 400);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.mapped());
    }

    const { taskId } = matchedData(req);
    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError("Task with id does not exist");
    }

    if (!isOwner(req, task.owner)) {
      throw new PermissionDeniedError();
    }

    await Task.findByIdAndDelete(taskId);

    res
      .status(StatusCodes.OK)
      .json({ data: "Task deleted successfully", statusCode: StatusCodes.OK });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      throw new BadRequestError("taskId is not a valid ObjectId");
    }

    throw new ApiError(e.message, 400);
  }
};
