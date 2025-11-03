import SectionHeader from "@/components/SectionHeader";

export default function ResumePage() {
  return (
    <div>
      <SectionHeader title="Resume" />
      <p className="text-sm text-neutral-300">
        Download a PDF version of my resume.
      </p>
      <a
        href="/resume.pdf"
        className="inline-block mt-4 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-800"
      >
        Download PDF resume
      </a>
    </div>
  );
}
