import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  password: string;
  email: string;
  profileImg: string;
  notes: Types.ObjectId[];
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    fullName: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    profileImg: { 
      type: String, 
      default: "" 
    },
    notes: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Note" 
    }],
    otp: { 
        type: String 
      },
    otpExpiry: { 
        type: Date 
      }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;