export default function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-300">
      {text}
    </span>
  );
}
