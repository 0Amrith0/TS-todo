import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  userId: Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    title: { 
        type: String, 
        required: true },
    content: { 
        type: String, 
        required: true },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;