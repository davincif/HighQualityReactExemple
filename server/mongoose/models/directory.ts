// External lib Imports
import mongoose from "mongoose";

// Internal Imports
import { validaccessLevels } from "../types/permissions";
import { standardFormat, timeNow } from "../../utils/times";

const { Schema } = mongoose;

const DirectorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Field name is required"],
  },
  father: {
    type: Schema.Types.ObjectId,
    ref: "Directory",
  },
  directories: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
    required: [true, "Field directories is required"],
    default: [],
  },
  files: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    required: [true, "Field files is required"],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Field owner is required"],
  },
  createdAt: {
    type: String,
    required: [true, "Field createdAt is required"],
    default: () => standardFormat(timeNow()),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Fied createdBy is required in access"],
  },
  modifiedAt: {
    type: String,
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

const Directory = mongoose.model("directory", DirectorySchema);

export default Directory;
