import getSupabaseServer from "@/lib/supabaseServer";

type Params = { params: { slug: string } };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPostPage({ params }: Params) {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return <div className="text-neutral-400">Not found.</div>;

  return (
    <article className="prose prose-invert prose-neutral max-w-none">
      <h1 className="font-serifhead text-3xl text-neutral-100">{data.title}</h1>
      {data.published_at ? (
        <div className="text-xs text-neutral-500 mb-6">
          {new Date(data.published_at).toLocaleDateString()}
        </div>
      ) : null}
      <div
        className="prose-dark"
        dangerouslySetInnerHTML={{ __html: data.body_html ?? "" }}
      />
    </article>
  );
}
