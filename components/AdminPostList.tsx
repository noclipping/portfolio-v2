"use client";
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
};

export default function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      if (!res.ok) {
        console.error("Failed to fetch posts");
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(postId: string, title: string) {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This will also delete the cover image from Cloudinary.`
      )
    ) {
      return;
    }

    setDeleting(postId);
    try {
      const res = await fetch(`/api/admin/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        alert(`Delete failed: ${error.error || "Unknown error"}`);
        return;
      }

      // Remove from local state (optimistic update)
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      // Also refresh to ensure consistency
      setTimeout(() => fetchPosts(), 500);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return <div className="text-neutral-400 text-sm">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="text-neutral-500 text-sm">No posts found.</div>;
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center justify-between p-3 border border-neutral-700 rounded"
        >
          <div className="flex-1">
            <div className="text-neutral-100 font-medium">{post.title}</div>
            <div className="text-xs text-neutral-400 mt-1">
              Slug: {post.slug} •{" "}
              {post.published ? (
                <span className="text-green-400">Published</span>
              ) : (
                <span className="text-neutral-500">Draft</span>
              )}
              {post.published_at && (
                <> • {new Date(post.published_at).toLocaleDateString()}</>
              )}
            </div>
          </div>
          <button
            onClick={() => handleDelete(post.id, post.title)}
            disabled={deleting === post.id}
            className="px-3 py-1 text-sm bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting === post.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
