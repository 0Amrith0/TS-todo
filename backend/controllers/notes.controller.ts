import { Response } from "express";
import Note from "../models/note.model";
import { AuthRequest } from "../middleware/protectRoute";


export async function getAllNotes(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.log("error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: "id cannot be found" });

    return res.status(200).json(note);
  } catch (error) {
    console.log("error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNewNote(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;
    const note = new Note({ title, content, userId: req.user._id });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.log("error in createNewNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "id cannot be found" });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.log("error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deletedNote) return res.status(404).json({ message: "id cannot be found" });

    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.log("error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
