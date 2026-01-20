import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CreateBlogFormProps {
  onSuccess?: () => void;
}

export function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setTitle("");
      setCategory("");
      setDescription("");
      setCoverImage("");
      setContent("");
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = category.split(",").map((c) => c.trim());
    mutation.mutate({
      title,
      category: categories,
      description,
      coverImage,
      content,
      date: new Date().toISOString(),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
          />
          <Input
            placeholder="Categories (comma separated)"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCategory(e.target.value)
            }
            required
          />
          <Input
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCoverImage(e.target.value)
            }
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            required
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            rows={10}
            required
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
