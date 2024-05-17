import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: [3, "username must be a minimum of 3 characters."],
      maxLength: [30, "username cannot exceed 50 characters"],
      required: [true, "username is required"],
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    methods: {
      checkPassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  }
);

UserSchema.plugin(uniqueValidator, {
  message: "User with {PATH} already exists",
});

/**
 * Hash a user's password before saving to the database
 */
UserSchema.pre("save", function (next) {
  const user = this;
  const hashedPassword = bcrypt.hashSync(user.password);

  if (user.isModified("password")) {
    user.password = hashedPassword;
    next();
  }
});

UserSchema.statics.exclude = function (...args) {
  return this.find().select(args.map((arg) => "-" + arg));
};

export default model("User", UserSchema);
