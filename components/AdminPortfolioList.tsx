"use client";
import { useState, useEffect } from "react";

type Portfolio = {
  id: string;
  name: string;
  link: string | null;
  icon_url: string | null;
  blurb: string | null;
  sort_order: number;
};

export default function AdminPortfolioList() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<Portfolio | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPortfolio() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      if (!res.ok) {
        console.error("Failed to fetch portfolio");
        return;
      }
      const data = await res.json();
      setPortfolio(data.portfolio || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortfolio();
  }, []);

  function startEdit(item: Portfolio) {
    setEditing(item.id);
    setEditingForm({ ...item });
  }

  function cancelEdit() {
    setEditing(null);
    setEditingForm(null);
  }

  async function handleSave(item: Portfolio) {
    const res = await fetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        link: item.link,
        icon_url: item.icon_url,
        blurb: item.blurb,
        sort_order: item.sort_order,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      alert(`Save failed: ${error.error || "Unknown error"}`);
      return;
    }

    setEditing(null);
    setEditingForm(null);
    fetchPortfolio(); // Refresh list
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        alert(`Delete failed: ${error.error || "Unknown error"}`);
        return;
      }

      setPortfolio((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return <div className="text-neutral-400 text-sm">Loading portfolio...</div>;
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-neutral-500 text-sm">No portfolio items yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {portfolio.map((item) => (
        <div
          key={item.id}
          className="p-3 border border-neutral-700 rounded space-y-2"
        >
          {editing === item.id && editingForm ? (
            // Edit mode
            <div className="space-y-2">
              <input
                className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Name"
                value={editingForm.name}
                onChange={(e) =>
                  setEditingForm({ ...editingForm, name: e.target.value })
                }
              />
              <input
                className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Link (e.g. stellar-learn.com)"
                value={editingForm.link || ""}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    link: e.target.value || null,
                  })
                }
              />
              <input
                className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Icon (emoji or image URL)"
                value={editingForm.icon_url || ""}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    icon_url: e.target.value || null,
                  })
                }
              />
              <input
                className="bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Sort Order"
                type="number"
                value={editingForm.sort_order}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    sort_order: Number(e.target.value),
                  })
                }
              />
              <textarea
                className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Blurb"
                value={editingForm.blurb || ""}
                onChange={(e) =>
                  setEditingForm({
                    ...editingForm,
                    blurb: e.target.value || null,
                  })
                }
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(editingForm)}
                  className="px-3 py-1 text-sm bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 text-sm bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {item.icon_url &&
                    (item.icon_url.startsWith("http://") ||
                    item.icon_url.startsWith("https://") ||
                    item.icon_url.startsWith("/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.icon_url}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span className="text-lg leading-none">
                        {item.icon_url}
                      </span>
                    ))}
                  <span className="text-neutral-100 font-medium">
                    {item.name}
                  </span>
                </div>
                {item.link && (
                  <div className="text-xs text-neutral-400 mt-1">
                    {item.link}
                  </div>
                )}
                {item.blurb && (
                  <div className="text-xs text-neutral-500 mt-1">
                    {item.blurb}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(item)}
                  className="px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={deleting === item.id}
                  className="px-2 py-1 text-xs bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/30 disabled:opacity-50"
                >
                  {deleting === item.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
