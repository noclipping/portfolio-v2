import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string | null;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  slug: string;
};

export default function PostCard({
  title,
  subtitle,
  coverImageUrl,
  publishedAt,
  slug,
}: Props) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block rounded-md overflow-hidden border border-neutral-800 hover:border-neutral-700"
    >
      {coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImageUrl} alt="" className="h-44 w-full object-cover" />
      ) : null}
      <div className="p-4">
        <div className="text-neutral-100 font-medium">{title}</div>
        {subtitle ? (
          <div className="text-sm text-neutral-400 mt-1">{subtitle}</div>
        ) : null}
        {publishedAt ? (
          <div className="text-xs text-neutral-500 mt-2">
            {new Date(publishedAt).toLocaleDateString()}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
