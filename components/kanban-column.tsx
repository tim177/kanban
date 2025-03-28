"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Task } from "@/lib/types";
import TaskCard from "./task-card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import TaskForm from "./task-form";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  color: string;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  color,
}: KanbanColumnProps) {
  const [showForm, setShowForm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      className={cn(
        "flex flex-col h-full min-h-[400px] rounded-lg bg-white shadow-sm overflow-hidden",
        isOver && "ring-2 ring-blue-400"
      )}
    >
      <div
        className="p-3 font-medium border-b"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length} {tasks.length === 1 ? "card" : "cards"}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto bg-gray-50"
      >
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-lg border-gray-300 text-gray-500 text-sm">
            No tasks
          </div>
        )}

        {showForm ? (
          <div className="mt-2">
            <TaskForm
              defaultStatus={status}
              onComplete={() => setShowForm(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-md hover:bg-gray-100"
          >
            <PlusCircle className="h-4 w-4" />
            Add card
          </button>
        )}
      </div>
    </div>
  );
}
