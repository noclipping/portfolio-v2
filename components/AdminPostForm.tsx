"use client";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

type Props = { onSaved?: () => void };

export default function AdminPostForm({ onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [bodyHtml, setBodyHtml] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    const json = await res.json();
    setCoverImageUrl(json.url);
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      alert("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        body_html: bodyHtml,
        published,
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorText = `HTTP ${res.status} ${res.statusText}`;
        try {
          const error = await res.json();
          console.error("API error response:", error);
          errorText = error.error || error.message || JSON.stringify(error);
        } catch (e) {
          const text = await res.text();
          console.error("Non-JSON error response:", text);
          errorText = text || errorText;
        }
        alert(`Save failed: ${errorText}`);
        return;
      }

      // Clear form on success
      setTitle("");
      setSlug("");
      setSubtitle("");
      setCoverImageUrl("");
      setBodyHtml("");
      setPublished(false);

      // Reload the page to refresh the post list
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-1">
            Blog Title *
          </label>
          <input
            className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 mb-1">Slug *</label>
          <input
            className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
            placeholder="blog-slug-url"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-neutral-400 mb-1">
          A blog title subtitle
        </label>
        <input
          className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Optional subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          className="flex-1 bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Cover Image URL"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
        />
        <input type="file" onChange={handleUpload} />
      </div>
      <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />{" "}
        Published
      </label>
      <button
        disabled={saving}
        onClick={handleSave}
        className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save / Publish"}
      </button>
    </div>
  );
}
