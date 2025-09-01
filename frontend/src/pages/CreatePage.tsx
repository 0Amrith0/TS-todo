import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface CreateForm {
  title: string;
  content: string;
}

interface CreateResponse {
  message: string;
  note: {
    _id: string;
    title: string;
    content: string;
  };
}

const CreatePage: React.FC = () => {
  const [formData, setFormData] = useState<CreateForm>({
    title: "",
    content: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createNote, isPending, isError, error } = useMutation<
    CreateResponse,
    Error,
    CreateForm
  >({
    mutationFn: async ({ title, content }) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create note");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Note created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate("/"); 
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNote(formData);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <form
          className="flex flex-col gap-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white text-center">
            Create a Task
          </h1>

          {/* Title */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <input
              type="text"
              className="grow bg-transparent focus:outline-none"
              placeholder="Title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              required
            />
          </label>

          {/* Content */}
          <textarea
            className="textarea textarea-bordered rounded w-full min-h-[120px] bg-transparent focus:outline-none"
            placeholder="Write your task details..."
            name="content"
            onChange={handleInputChange}
            value={formData.content}
            required
          />

          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Task"}
          </button>

          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
