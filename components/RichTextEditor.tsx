"use client";
import { useRef, useEffect, useCallback } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
  const lastSyncedValueRef = useRef<string>("");

  // Initialize editor content on mount
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
      lastSyncedValueRef.current = value;
    }
  }, []);

  // Sync external value changes to editor (when parent clears form, etc.)
  useEffect(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    const valueHtml = value || "";

    // Only update if value changed externally and is different from what we have
    if (
      valueHtml !== lastSyncedValueRef.current &&
      valueHtml !== editorRef.current.innerHTML
    ) {
      isUpdatingRef.current = true;
      editorRef.current.innerHTML = valueHtml;
      lastSyncedValueRef.current = valueHtml;
      // Reset flag in next tick to avoid render-phase updates
      requestAnimationFrame(() => {
        isUpdatingRef.current = false;
      });
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    lastSyncedValueRef.current = newHtml;
    // Use requestAnimationFrame to avoid render-phase updates
    requestAnimationFrame(() => {
      onChange(newHtml);
    });
  }, [onChange]);

  function execCommand(cmd: string, value?: string) {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    document.execCommand(cmd, false, value);
    editorRef.current.focus();
    // Reset flag and sync after command executes
    requestAnimationFrame(() => {
      isUpdatingRef.current = false;
      handleInput();
    });
  }

  return (
    <div className="border border-neutral-700 rounded">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b border-neutral-700 bg-neutral-900">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="w-px bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h2")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h3")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "p")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Paragraph"
        >
          P
        </button>
        <div className="w-px bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCommand("createLink", url);
          }}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-px bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="px-2 py-1 text-sm border border-neutral-700 rounded hover:bg-neutral-800"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] bg-neutral-900 p-4 text-neutral-300 focus:outline-none"
        style={{
          lineHeight: "1.6",
        }}
      />
    </div>
  );
}
