import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, fetchBlogById } from "./api";
import { BlogCard } from "./components/BlogCard";
import { BlogDetail } from "./components/BlogDetail";
import { CreateBlogForm } from "./components/CreateBlogForm";
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showDetailOverlay, setShowDetailOverlay] = useState(false);

  const {
    data: blogs,
    isLoading: isBlogsLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  const { data: selectedBlog, isLoading: isBlogLoading } = useQuery({
    queryKey: ["blog", selectedBlogId],
    queryFn: () => fetchBlogById(selectedBlogId!),
    enabled: !!selectedBlogId,
  });

  // Auto-select first blog if none selected and blogs are loaded
  useEffect(() => {
    if (!selectedBlogId && blogs && blogs.length > 0) {
      setSelectedBlogId(blogs[0].id);
      setIsInitialLoad(false);
    }
  }, [blogs, selectedBlogId]);

  const blogsPerPage = 5;
  const totalPages = blogs ? Math.ceil(blogs.length / blogsPerPage) : 0;
  const paginatedBlogs = blogs?.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isBlogsLoading)
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="w-full">
          <div className="flex flex-col xl:flex-row gap-6 min-h-screen p-8 bg-white rounded-lg">
            <div className="xl:w-1/4 space-y-3 h-full p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading blogs...</p>
              </div>
            </div>
            <div className="xl:w-3/4 h-full p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading content...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <div className="p-4">Error loading blogs</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 px-8 py-6">
          <h1 className="text-2xl sm:text-6xl font-bold text-gray-900 ">
            CA MONK BLOGS
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-950 hover:bg-gray-800 text-white">
                Create Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90">
              <DialogHeader>
                <DialogTitle>Create New Blog</DialogTitle>
              </DialogHeader>
              <CreateBlogForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div
          className={`flex flex-col xl:flex-row gap-6 min-h-screen p-8 transition-opacity duration-700 ease-in-out ${isInitialLoad ? "opacity-0" : "opacity-100"}`}
        >
          {/* Desktop Layout - Sidebar */}
          <div className="xl:w-1/4 space-y-3 h-full p-6 xl:block hidden transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold">All Blogs</h2>
            <div className="space-y-8 overflow-y-auto">
              {paginatedBlogs?.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onClick={() => setSelectedBlogId(blog.id)}
                  isSelected={selectedBlogId === blog.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </Button>

                <span className="text-sm px-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </Button>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Layout - Expandable Cards */}
          <div className="xl:hidden w-full space-y-3">
            <h2 className="text-xl font-semibold mb-4">All Blogs</h2>
            <div className="space-y-4">
              {paginatedBlogs?.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onClick={() => {
                    setSelectedBlogId(blog.id);
                    setShowDetailOverlay(true);
                  }}
                  isSelected={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </Button>

                <span className="text-sm px-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Detail Panel */}
          <div className="xl:w-3/4 p-4 h-full overflow-y-auto xl:block hidden">
            <div className="transition-opacity duration-500 ease-in-out">
              {isBlogLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog details...</p>
                  </div>
                </div>
              ) : selectedBlog ? (
                <BlogDetail blog={selectedBlog} />
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  Select a blog to view details
                </div>
              )}
            </div>
          </div>

          {/* Mobile Detail Overlay */}
          {showDetailOverlay && (
            <div className="fixed inset-0 z-50 xl:hidden">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowDetailOverlay(false)} />
              <div className="relative h-full bg-white/90 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailOverlay(false)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blogs
                  </Button>
                </div>
                <div className="p-4">
                  {isBlogLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">Loading...</p>
                      </div>
                    </div>
                  ) : selectedBlog ? (
                    <BlogDetail blog={selectedBlog} />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
