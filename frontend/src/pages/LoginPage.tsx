import { useState } from "react"; 
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import toast from "react-hot-toast";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isError, isPending, error} = useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: async ({ username, password }) => {
      try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type" : "application/json"
					},
					body: JSON.stringify({username, password})
				})

				const data = await res.json();
				if(!res.ok) throw new Error(data.error || "Failed to login");
				return data;
			} catch (error) {
				console.log(error)
				throw error;
			}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <form className="flex gap-4 flex-col w-full max-w-sm" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail size={20} />
            <input
              type="text"
              className="grow bg-transparent focus:outline-none"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              required
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword size={20} />
            <input
              type="password"
              className="grow bg-transparent focus:outline-none"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>

          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-500">{error?.message}</p>
          )}
        </form>

        <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
          <p className="text-black text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-black btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
