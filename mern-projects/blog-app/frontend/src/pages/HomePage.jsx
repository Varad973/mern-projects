import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch blogs. Make sure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading blogs...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>All Blogs</h1>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-message">
          <h2>No blogs yet</h2>
          <p>Create your first blog post to get started!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
