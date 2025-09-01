import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

interface SignupResponse {
  message: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
    fullName: ""
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutation, isError, isPending, error } = useMutation<SignupResponse, Error, SignupForm>({
    mutationFn: async ({ username, email, password, fullName }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, fullName }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to signup");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Signup successful!");
      navigate("/login");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation(formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className="max-w-screen-xl mx-auto flex h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-extrabold text-white text-center">Join today.</h1>

            {/* Email */}
            <label className="input input-bordered rounded flex items-center gap-2 w-full">
              <MdOutlineMail size={20} />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>

            {/* Username */}
            <label className="input input-bordered rounded flex items-center gap-2 w-full">
              <FaUser size={20} />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>

            {/* Full Name */}
            <label className="input input-bordered rounded flex items-center gap-2 w-full">
              <MdDriveFileRenameOutline size={20} />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                required
              />
            </label>

            {/* Password */}
            <label className="input input-bordered rounded flex items-center gap-2 w-full">
              <MdPassword size={20} />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>

            <button
              className="btn rounded-full btn-primary text-white w-full"
              type="submit"
            >
              {isPending ? "Loading..." : "Sign up"}
            </button>

            {isError && <p className="text-red-500">{error.message}</p>}
          </form>

          <div className="flex flex-col gap-2 mt-4 text-center">
            <p className="text-white text-lg">Already have an account?</p>
            <Link to="/login">
              <button className="btn rounded-full btn-primary text-black btn-outline w-full">Sign in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
	);
};

export default SignupPage;
