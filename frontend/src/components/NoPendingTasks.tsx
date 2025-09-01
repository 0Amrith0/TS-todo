import React from "react";
import { NotebookIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const NoPendingTasks: React.FC = () => {
  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      console.log("me endpoint response:", data);
      return data;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <NotebookIcon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">
        {isLoading
          ? "Loading..."
          : "Welcome"}
      </h3>
      <p className="text-base-content/70">
        Ready to work? Create your tasks to get started on your journey.
      </p>
      <Link to="/create" className="btn btn-neutral hover:bg-black/30 border-none text-white">
        Create Your First Task
      </Link>
    </div>
  );
};

export default NoPendingTasks;