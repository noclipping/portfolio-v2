"use client";
import { useState } from "react";

export default function AdminPortfolioForm() {
  const [form, setForm] = useState({
    name: "",
    link: "",
    iconUrl: "",
    blurb: "",
    sortOrder: 0,
  });
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    const res = await fetch("/api/admin/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        link: form.link.trim() || null,
        icon_url: form.iconUrl.trim() || null,
        blurb: form.blurb.trim() || null,
        sort_order: Number(form.sortOrder),
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      alert(`Save failed: ${error.error || "Unknown error"}`);
      return;
    }

    // Clear form
    setForm({
      name: "",
      link: "",
      iconUrl: "",
      blurb: "",
      sortOrder: 0,
    });

    // Reload page to refresh list
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-3">
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Name (required)"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
      />
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Link (e.g. stellar-learn.com or https://www.stellar-learn.com)"
        value={form.link}
        onChange={(e) => set("link", e.target.value)}
      />
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Icon (emoji or image URL)"
        value={form.iconUrl}
        onChange={(e) => set("iconUrl", e.target.value)}
      />
      <input
        className="bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Sort Order"
        type="number"
        value={form.sortOrder}
        onChange={(e) => set("sortOrder", Number(e.target.value))}
      />
      <textarea
        className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Blurb"
        value={form.blurb}
        onChange={(e) => set("blurb", e.target.value)}
      />
      <button
        onClick={handleSave}
        className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800"
      >
        Save Portfolio Item
      </button>
    </div>
  );
}
