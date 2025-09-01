import express from "express"
import { getAllNotes, getNoteById, createNewNote, updateNote, deleteNote } from "../controllers/notes.controller";
import { protectRoute } from "../middleware/protectRoute";


const router = express.Router();


router.get("/", protectRoute, getAllNotes);
router.get("/:id", protectRoute, getNoteById);
router.post('/', protectRoute, createNewNote); 
router.put('/:id', protectRoute, updateNote);
router.delete('/:id', protectRoute, deleteNote);

export default router;