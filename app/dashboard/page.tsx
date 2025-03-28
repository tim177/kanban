import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/kanban-board";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto py-6 px-4 h-[calc(100vh-80px)]">
      <h1 className="mb-6 text-3xl font-bold">Your Kanban Board</h1>
      <KanbanBoard />
    </main>
  );
}
