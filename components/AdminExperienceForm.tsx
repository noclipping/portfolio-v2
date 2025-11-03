"use client";
import { useState } from "react";

export default function AdminExperienceForm() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    statusTag: "",
    years: "",
    blurb: "",
    link: "",
    iconUrl: "",
    sortOrder: 0,
  });
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) {
      alert("Name and role are required");
      return;
    }

    const res = await fetch("/api/admin/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        role: form.role.trim(),
        status_tag: form.statusTag.trim() || null,
        years: form.years.trim() || null,
        blurb: form.blurb.trim() || null,
        link: form.link.trim() || null,
        icon_url: form.iconUrl.trim() || null,
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
      role: "",
      statusTag: "",
      years: "",
      blurb: "",
      link: "",
      iconUrl: "",
      sortOrder: 0,
    });

    // Reload page to refresh list
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          className="bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <input
          className="bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Role"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          className="bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Status Tag (e.g. Current, Exited)"
          value={form.statusTag}
          onChange={(e) => set("statusTag", e.target.value)}
        />
        <input
          className="bg-neutral-900 border border-neutral-700 px-2 py-1"
          placeholder="Years (e.g. 2025-Present)"
          value={form.years}
          onChange={(e) => set("years", e.target.value)}
        />
      </div>
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1"
        placeholder="Link/Domain (e.g. stellar-learn.com or https://www.stellar-learn.com)"
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
        Save Row
      </button>
    </div>
  );
}
