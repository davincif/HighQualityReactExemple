// External lib Imports
import mongoose from "mongoose";

// Internal Imports
import { validaccessLevels } from "../types/permissions";
import { timeNow } from "../../utils/times";

const { Schema } = mongoose;

const FileSchema = new Schema({
  name: {
    type: String,
    required: [true, "Field name is required"],
  },
  father: {
    type: Schema.Types.ObjectId,
    ref: "Directory",
    required: [true, "Field father is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Field owner is required"],
  },
  createdAt: {
    type: Date,
    required: [true, "Field createdAt is required"],
    default: () => timeNow(),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Fied createdBy is required in access"],
  },
  modifiedAt: {
    type: Date,
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  access: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: [true, "Fied user is required in access"],
        },
        level: {
          type: String,
          enum: validaccessLevels,
          default: "guest",
          required: [true, "Fied level is required in access"],
        },
      },
    ],
    required: [true, "Fied access is required"],
    default: [],
  },
});

const File = mongoose.model("file", FileSchema);

export default File;
