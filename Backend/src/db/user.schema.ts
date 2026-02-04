import mongoose from "mongoose";
const schema = mongoose.Schema;

const UserSchema = new schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  shareToken: { type: String },
  collectionShareToken: { type: String },
  collectionShared: { type: Boolean, default: false },
  collectionSharedAt: { type: Date }
});

const ContentSchema = new schema({
  types: {
    type: String,
    required: true,
    enum: ["document", "Twitter", "youtube"],
  },
  link: { type: String, required: true },
  title: { type: String, required: true },
  tags: { type: String, required: true },
  UserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
});

export const UserModel = mongoose.model("user", UserSchema);
export const ContentModel = mongoose.model("content", ContentSchema);
