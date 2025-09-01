import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NavBar: React.FC = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md border-b border-white/10 z-50">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between text-black">
          <h1 className="text-3xl font text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                logoutMutation();
              }}
              className="flex items-center gap-2 bg-transparent hover:bg-white/20 
              text-white px-4 py-2 rounded-md transition"
            >
              <BiLogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
