import { cookies } from "next/headers";
import SectionHeader from "@/components/SectionHeader";
import AdminPostForm from "@/components/AdminPostForm";
import AdminPostList from "@/components/AdminPostList";
import AdminExperienceForm from "@/components/AdminExperienceForm";
import AdminExperienceList from "@/components/AdminExperienceList";
import AdminPortfolioForm from "@/components/AdminPortfolioForm";
import AdminPortfolioList from "@/components/AdminPortfolioList";

async function AdminGate() {
  const c = cookies();
  const isAuthed = c.get("admin")?.value === "1";
  if (isAuthed) return null;
  return (
    <form className="space-y-3" action="/api/admin/login" method="post">
      <SectionHeader title="Admin Login" />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="bg-neutral-900 border border-neutral-700 px-2 py-1"
      />
      <button className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm hover:bg-neutral-800">
        Login
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const c = cookies();
  const isAuthed = c.get("admin")?.value === "1";
  const gate = await AdminGate();
  if (!isAuthed) return gate;
  return (
    <div className="space-y-10">
      <div>
        <SectionHeader title="New Blog Post" />
        <AdminPostForm />
      </div>

      <div className="border-t border-neutral-800 pt-10">
        <SectionHeader title="Existing Posts" />
        <AdminPostList />
      </div>

      <div className="border-t border-neutral-800 pt-10">
        <SectionHeader title="Add Experience Entry" />
        <AdminExperienceForm />
      </div>

      <div className="border-t border-neutral-800 pt-10">
        <SectionHeader title="Existing Experience" />
        <AdminExperienceList />
      </div>

      <div className="border-t border-neutral-800 pt-10">
        <SectionHeader title="Add Portfolio Item" />
        <AdminPortfolioForm />
      </div>

      <div className="border-t border-neutral-800 pt-10">
        <SectionHeader title="Existing Portfolio" />
        <AdminPortfolioList />
      </div>
    </div>
  );
}
