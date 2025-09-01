import React from "react";
import { Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Note } from "../types";

type NoteCardProps = {
  note: Note;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  serialNumber: number;
};

const NoteCard: React.FC<NoteCardProps> = ({ note, setNotes, serialNumber }) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!window.confirm("Are you finished with the task?")) return;

    try {
      const res = await fetch(`/api/notes/${note._id}`, { method: "DELETE" });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== note._id));
        alert("Task deleted successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete the task");
    }
  };

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto">
      {/* Grid layout: 1 card on small, 2 on md, 3 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center">
        <Link
          to={`/note/${note._id}`}
          className="bg-amber-50 hover:shadow-md transition-all duration-200 
                    w-[227px] h-[48px] flex items-center justify-between 
                    px-3 rounded-md"
        >
          {/* Note text and serial number */}
          <p className="text-base-content/70 truncate">
            {serialNumber}. {note.content}
          </p>

          {/* Delete button (same line) */}
          <button
            className="text-black hover:text-red-600"
            onClick={handleDelete}
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  ); 
};

export default NoteCard;