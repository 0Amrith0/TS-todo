import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import NoteCard from "../components/NoteCard";
import NoPendingTasks from "../components/NoPendingTasks";
import type { Note } from "../types";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await fetch("/api/notes", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data: Note[] = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setIsLoading(false);
      }
    };

    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    getNotes();
    getUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 mt-[2cm] w-full">
        {/* Welcome card spanning same width as navbar */}
        <div className="bg-white shadow-md rounded-md p-4 mb-6 w-full">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {username} !
          </h2>
          <p className="text-sm text-gray-600">Email: {email}</p>
        </div>

        {/* Centered Create button */}
        <div className="flex justify-center mb-8">
          <Link to = "/create"
            className="bg-blue-500 hover:bg-blue-600 text-white 
                       w-[227px] rounded-md shadow-md 
                       flex items-center justify-center text-base font-medium"
            style={{ height: "1.5cm" }}
          >
            + Create Note
          </Link >
        </div>

        {isLoading && (
          <div className="text-center text-primary py-10">
            Loading your tasks...
          </div>
        )}

        {!isLoading && notes.length === 0 && <NoPendingTasks />}

        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {notes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
                serialNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
