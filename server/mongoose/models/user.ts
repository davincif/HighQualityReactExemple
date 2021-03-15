// External lib Imports
import mongoose from "mongoose";
const { Schema } = mongoose;

// Local Imports
import { timeNow } from "../../utils/times";

const UserSchema = new Schema({
  nick: {
    // id: Schema.Types.ObjectId,
    type: String,
    required: [true, "Field nick is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Field name is required"],
  },
  password: {
    type: String,
    required: [true, "Field password is required"],
  },
  email: {
    type: String,
    required: [true, "Field email is required"],
    unique: true,
  },
  birth: {
    type: Date,
    required: [true, "Field birth is required"],
  },
  createdAt: {
    type: Date,
    required: [true, "Field createdAt is required"],
    default: () => timeNow(),
  },
  active: {
    type: Boolean,
    default: true,
    required: [true, "Field active is required"],
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
