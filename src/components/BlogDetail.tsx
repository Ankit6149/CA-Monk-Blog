import type { Blog } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface BlogDetailProps {
  blog: Blog;
}

export function BlogDetail({ blog }: BlogDetailProps) {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-t-lg"
        />
        <CardTitle className="text-4xl p-2 text-gray-800 font-bold">
          {blog.title}
        </CardTitle>
        <div className="flex gap-2">
          {blog.category.map((cat) => (
            <span
              key={cat}
              className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {new Date(blog.date).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
      </CardContent>
    </Card>
  );
}
