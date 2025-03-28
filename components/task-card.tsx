"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2 } from "lucide-react";
import { useTaskStore } from "@/lib/store";
import TaskForm from "./task-form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteTask, updateTask } = useTaskStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleToggleComplete = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTask(task._id, { status: newStatus });
  };

  if (isEditing) {
    return <TaskForm task={task} onComplete={() => setIsEditing(false)} />;
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing bg-white hover:shadow-md transition-all pt-4 pb-1 gap-1",
        isDragging || isSortableDragging
          ? "opacity-50 shadow-md ring-2 ring-blue-400"
          : "opacity-100"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="px-3">
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <Checkbox
              id={`task-${task._id}`}
              checked={task.status === "done"}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={cn(
                    "text-sm font-medium leading-tight",
                    task.status === "done" && "line-through text-gray-500"
                  )}
                >
                  {task.title}
                </h4>
                {task.priority && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap border",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
              {task.description && (
                <p
                  className={cn(
                    "text-xs text-gray-500 mt-1",
                    task.status === "done" && "line-through"
                  )}
                >
                  {task.description}
                </p>
              )}

              {task.points && (
                <div className="mt-2 text-xs text-gray-500">
                  {task.points} points
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 pb-2 flex justify-between items-center border-t border-gray-100 mt-1 pt-2">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-red-100 text-red-500"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
