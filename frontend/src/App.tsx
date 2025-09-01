import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CreatePage from "./pages/CreatePage";

import LoadingSpinner from "./common/LoadingSpinner";

interface AuthUser {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  profileImg?: string;
}

function App() {
  const { data: authUser, isLoading } = useQuery<AuthUser | null, Error>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data as AuthUser;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path = "/create" element = {<CreatePage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
