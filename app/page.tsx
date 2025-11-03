import SectionHeader from "@/components/SectionHeader";
import ExperienceRow from "@/components/ExperienceRow";
import PortfolioItem from "@/components/PortfolioItem";
import PostCard from "@/components/PostCard";
import getSupabaseServer from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let experience = null;
  let portfolio = null;
  let posts = null;
  let expError = null;
  let portfolioError = null;
  let postsError = null;

  try {
    // Use service role for reads (bypasses RLS)
    // If RLS issues occur, we could switch to anon key for public reads
    const supabase = getSupabaseServer();

    const expResult = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });

    experience = expResult.data;
    expError = expResult.error;

    const portfolioResult = await supabase
      .from("portfolio")
      .select("*")
      .order("sort_order", { ascending: true });

    portfolio = portfolioResult.data;
    portfolioError = portfolioResult.error;

    if (expError) {
      console.error("Experience query error:", expError);
    }

    if (portfolioError) {
      console.error("Portfolio query error:", portfolioError);
    }

    // Get all posts first to check data
    const allPostsCheck = await supabase.from("posts").select("*").limit(10);

    console.log("Homepage - All posts:", allPostsCheck.data?.length || 0);

    // Try query with filter
    let postsResult = await supabase
      .from("posts")
      .select("title, subtitle, cover_image_url, published_at, slug")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3);

    // If query returns empty but we know posts exist, filter manually
    // IMPORTANT: Only shows published posts - filters by published === true
    if (
      (!postsResult.data || postsResult.data.length === 0) &&
      allPostsCheck.data
    ) {
      // Only include posts where published is explicitly true
      const publishedOnly = allPostsCheck.data.filter(
        (p: any) => p.published === true
      );

      console.log(
        `Homepage: Filtered ${publishedOnly.length} published posts from ${allPostsCheck.data.length} total`
      );

      const filtered = publishedOnly
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
        )
        .slice(0, 3);

      postsResult = { data: filtered, error: null };
    }

    posts = postsResult.data;
    postsError = postsResult.error;

    if (postsError) {
      console.error("Posts query error:", postsError);
    }

    console.log("Fetched posts:", posts?.length || 0, posts);
  } catch (error) {
    console.error("HomePage error:", error);
    // Continue rendering with null data rather than crashing
  }

  return (
    <div>
      {/* Top bar: Name left, nav right */}
      <div className="flex items-start justify-between mb-8">
        <div className="text-xl font-serifhead text-neutral-100">
          Devon Selvaggi
        </div>
        <nav className="text-sm text-neutral-400 flex flex-col items-end gap-1">
          <a className="hover:text-neutral-200 hover:underline" href="#work">
            Work
          </a>
          <a
            className="hover:text-neutral-200 hover:underline"
            href="#portfolio"
          >
            Portfolio
          </a>
          <a className="hover:text-neutral-200 hover:underline" href="#contact">
            Contact
          </a>
          <a className="hover:text-neutral-200 hover:underline" href="/blog">
            Blog
          </a>
          <a className="hover:text-neutral-200 hover:underline" href="/resume">
            Resume
          </a>
        </nav>
      </div>

      {/* Profile picture - centered */}
      <div className="flex justify-center my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/headshot.jpg"
          alt="Devon Selvaggi"
          className="w-32 h-32 rounded-lg object-cover"
        />
      </div>

      {/* Main name heading */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-serifhead text-neutral-100">
          Devon Selvaggi
        </h1>
      </div>

      {/* Intro text */}
      <div className="text-sm leading-6 text-neutral-300 mb-6 text-center max-w-2xl mx-auto">
        I build learning systems and simple tools for operators. Recent work
        spans LMS platforms, combat sports tooling, and Stripe/calendar
        automations.
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 justify-center mb-10 text-sm">
        <span className="text-pink-400">📍</span>
        <span className="text-neutral-400">Location</span>
        <span className="font-semibold text-neutral-100">Scranton, PA</span>
      </div>

      {/* Work blurb */}
      <div id="work" className="border-t border-neutral-800 pt-10 mt-10">
        <SectionHeader title="Work" />
        <p className="text-sm text-neutral-300">
          Presently leading builds at the intersection of education and operator
          tooling. Previously shipped booking, payments, and internal ops
          systems.
        </p>
      </div>

      {/* Experience */}
      <div className="border-t border-neutral-800 pt-10 mt-10">
        <SectionHeader title="Jobs" />
        {expError ? (
          <div className="text-red-400 text-sm">
            Error loading experience: {expError.message}
          </div>
        ) : experience && experience.length > 0 ? (
          <div>
            {experience.map((e) => (
              <ExperienceRow
                key={e.id}
                name={e.name}
                role={e.role}
                statusTag={e.status_tag}
                years={e.years}
                blurb={e.blurb}
                link={e.link}
                iconUrl={e.icon_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">
            No experience entries yet.
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div id="portfolio" className="border-t border-neutral-800 pt-10 mt-10">
        <SectionHeader title="Portfolio" />
        {portfolioError ? (
          <div className="text-red-400 text-sm">
            Error loading portfolio: {portfolioError.message}
          </div>
        ) : portfolio && portfolio.length > 0 ? (
          <div>
            {portfolio.map((p) => (
              <PortfolioItem
                key={p.id}
                name={p.name}
                link={p.link}
                iconUrl={p.icon_url}
                blurb={p.blurb}
              />
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 text-sm">
            No portfolio items yet.
          </div>
        )}
      </div>

      {/* Latest blog */}
      <div className="border-t border-neutral-800 pt-10 mt-10">
        <SectionHeader title="Latest Posts" />
        {postsError ? (
          <div className="text-red-400 text-sm">
            Error loading posts: {postsError.message}
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
            No posts yet. Create one in /admin
          </div>
        )}
      </div>

      {/* Contact */}
      <div id="contact" className="border-t border-neutral-800 pt-10 mt-10">
        <SectionHeader title="Contact" />
        <p className="text-sm text-neutral-300 mb-4">
          I get a lot of messages but try to respond to them all. For business
          inquiries or job opportunities, please email me.
        </p>
        <div>
          <a
            className="text-sm text-neutral-400 underline hover:text-neutral-200"
            href="mailto:devonselvaggi@gmail.com"
          >
            devonselvaggi@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
