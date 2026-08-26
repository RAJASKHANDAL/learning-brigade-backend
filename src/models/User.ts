import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // undefined for Google-only users

    role: {
      type: String,
      enum: ["student", "teacher", "admin"] as const,
      default: "student",
    },

    interestField: { type: String, default: null },
    subInterests: { type: [String], default: [] },
    joinedClasses: { type: [String], default: [] },
    studentType: { type: String, default: null },
    age: { type: String, default: null },
    mobile: { type: String, default: null },

    profileImage: { type: String, default: null },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;

export const User = model("User", userSchema);
