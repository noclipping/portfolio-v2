"use client";
import { useState, useEffect } from "react";
import Badge from "./Badge";

type Experience = {
  id: string;
  name: string;
  role: string;
  status_tag: string | null;
  years: string | null;
  blurb: string | null;
  link: string | null;
  icon_url: string | null;
  sort_order: number;
};

export default function AdminExperienceList() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<Experience | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchExperience() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      if (!res.ok) {
        console.error("Failed to fetch experience");
        return;
      }
      const data = await res.json();
      setExperience(data.experience || []);
    } catch (err) {
      console.error("Error fetching experience:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperience();
  }, []);

  function startEdit(exp: Experience) {
    setEditing(exp.id);
    setEditingForm({ ...exp });
  }

  function cancelEdit() {
    setEditing(null);
    setEditingForm(null);
  }

  async function handleSave(exp: Experience) {
    const res = await fetch("/api/admin/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: exp.id,
        name: exp.name,
        role: exp.role,
        status_tag: exp.status_tag,
        years: exp.years,
        blurb: exp.blurb,
        link: exp.link,
        icon_url: exp.icon_url,
        sort_order: exp.sort_order,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      alert(`Save failed: ${error.error || "Unknown error"}`);
      return;
    }

    setEditing(null);
    setEditingForm(null);
    fetchExperience(); // Refresh list
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        alert(`Delete failed: ${error.error || "Unknown error"}`);
        return;
      }

      setExperience((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="text-neutral-400 text-sm">Loading experience...</div>
    );
  }

  if (experience.length === 0) {
    return (
      <div className="text-neutral-500 text-sm">No experience entries yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {experience.map((exp) => (
        <div
          key={exp.id}
          className="p-3 border border-neutral-700 rounded space-y-2"
        >
          {editing === exp.id && editingForm ? (
            // Edit mode
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                  placeholder="Name"
                  value={editingForm.name}
                  onChange={(e) =>
                    setEditingForm({ ...editingForm, name: e.target.value })
                  }
                />
                <input
                  className="bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                  placeholder="Role"
                  value={editingForm.role}
                  onChange={(e) =>
                    setEditingForm({ ...editingForm, role: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                  placeholder="Status (e.g. Current)"
                  value={editingForm.status_tag || ""}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      status_tag: e.target.value || null,
                    })
                  }
                />
                <input
                  className="bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                  placeholder="Years (e.g. 2025-Present)"
                  value={editingForm.years || ""}
                  onChange={(e) =>
                    setEditingForm({
                      ...editingForm,
                      years: e.target.value || null,
                    })
                  }
                />
              </div>
              <input
                className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm"
                placeholder="Link/Domain (e.g. stellar-learn.com)"
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
                  {exp.icon_url &&
                    (exp.icon_url.startsWith("http://") ||
                    exp.icon_url.startsWith("https://") ||
                    exp.icon_url.startsWith("/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={exp.icon_url}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span className="text-lg leading-none">
                        {exp.icon_url}
                      </span>
                    ))}
                  <span className="text-neutral-100 font-medium">
                    {exp.name}
                  </span>
                  {exp.status_tag && <Badge text={exp.status_tag} />}
                </div>
                <div className="text-xs text-neutral-400 mt-1 space-x-2">
                  <span>{exp.role}</span>
                  {exp.link && <span>• {exp.link}</span>}
                  {exp.years && <span>• {exp.years}</span>}
                </div>
                {exp.blurb && (
                  <div className="text-xs text-neutral-500 mt-1">
                    {exp.blurb}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(exp)}
                  className="px-2 py-1 text-xs bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.name)}
                  disabled={deleting === exp.id}
                  className="px-2 py-1 text-xs bg-red-900/20 border border-red-700 text-red-400 rounded hover:bg-red-900/30 disabled:opacity-50"
                >
                  {deleting === exp.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
