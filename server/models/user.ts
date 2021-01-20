import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    // _id: Schema.Types.ObjectId,
    type: String,
    required: [true, "Name field is required"],
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
  },
  active: {
    type: Boolean,
    default: true,
    required: [true, "Password field is required"],
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
