import type { Blog } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface BlogCardProps {
  blog: Blog;
  onClick: () => void;
  isSelected?: boolean;
}

export function BlogCard({ blog, onClick, isSelected }: BlogCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-shadow p-8 ${isSelected ? "shadow-lg bg-gray-100" : "hover:shadow-lg hover:border-gray-500"}`}
      onClick={onClick}
    >
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-lg font-bold text-gray-600">
          {blog.title}
        </CardTitle>
        <div className="flex gap-2 flex-wrap mt-1">
          {blog.category.map((cat) => (
            <span
              key={cat}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <p className="text-gray-600 text-sm line-clamp-2">{blog.description}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(blog.date).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
