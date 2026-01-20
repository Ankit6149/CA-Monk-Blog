import type { Blog } from "./types";

const API_BASE = "http://localhost:3001";

export const fetchBlogs = async (): Promise<Blog[]> => {
  const response = await fetch(`${API_BASE}/blogs`);
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
};

export const fetchBlogById = async (id: string): Promise<Blog> => {
  const response = await fetch(`${API_BASE}/blogs/${id}`);
  if (!response.ok) throw new Error("Failed to fetch blog");
  return response.json();
};

export const createBlog = async (blog: Omit<Blog, "id">): Promise<Blog> => {
  const response = await fetch(`${API_BASE}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!response.ok) throw new Error("Failed to create blog");
  return response.json();
};
