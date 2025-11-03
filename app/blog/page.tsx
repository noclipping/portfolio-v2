import PostCard from "@/components/PostCard";
import getSupabaseServer from "@/lib/supabaseServer";
import SectionHeader from "@/components/SectionHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogListPage() {
  let posts = null;
  let error = null;

  try {
    const supabase = getSupabaseServer();

    // Get all posts first (service role bypasses RLS)
    const allPostsResult = await supabase.from("posts").select("*").limit(100);

    // Try direct filter first
    const postsResult = await supabase
      .from("posts")
      .select("title, subtitle, cover_image_url, published_at, slug")
      .eq("published", true)
      .order("published_at", { ascending: false });

    // If Supabase filter doesn't work (RLS issue?), filter manually
    // IMPORTANT: This still only shows published posts - we filter by published === true
    if (!postsResult.data || postsResult.data.length === 0) {
      const all = allPostsResult.data || [];
      // Only include posts where published is explicitly true
      const publishedOnly = all.filter((p: any) => p.published === true);

      posts = publishedOnly
        .map((p: any) => ({
          title: p.title,
          subtitle: p.subtitle,
          cover_image_url: p.cover_image_url,
          published_at: p.published_at,
          slug: p.slug,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(b.published_at || 0).getTime() -
            new Date(a.published_at || 0).getTime()
        );
      error = null;
    } else {
      posts = postsResult.data;
      error = postsResult.error;
    }
  } catch (err) {
    console.error("BlogListPage error:", err);
    error = err as Error;
  }

  return (
    <div>
      <SectionHeader title="Writing" />
      {error ? (
        <div className="text-red-400 text-sm">
          Error: {error.message || JSON.stringify(error)}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((p) => (
            <PostCard
              key={p.slug}
              title={p.title}
              subtitle={p.subtitle}
              coverImageUrl={p.cover_image_url}
              publishedAt={p.published_at}
              slug={p.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-neutral-500 text-sm">
          No published posts found. Check console logs for details.
        </div>
      )}
    </div>
  );
}
