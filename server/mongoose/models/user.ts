import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  nick: {
    // _id: Schema.Types.ObjectId,
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
    type: String,
    required: [true, "Field birth is required"],
  },
  accessLevel: {
    type: String,
    enum: ["master", "family", "guest"],
    default: "guest",
    required: [true, "Fied accessLevel is required"],
  },
  active: {
    type: Boolean,
    default: true,
    required: [true, "Field active is required"],
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
