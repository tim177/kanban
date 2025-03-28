import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
        Manage Your Tasks with Kanban
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        A simple and intuitive kanban board to help you organize and track your
        tasks efficiently.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/register">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
