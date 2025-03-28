"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useTaskStore } from "@/lib/store";
import KanbanColumn from "./kanban-column";
import TaskForm from "./task-form";
import type { Task } from "@/lib/types";
import TaskCard from "./task-card";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function KanbanBoard() {
  const { data: session } = useSession();
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [fetchTasks, session?.user?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: "todo", title: "To do (not estimated)", color: "#E5E7EB" },
    { id: "in-progress", title: "In progress", color: "#FDE68A" },
    { id: "in-review", title: "In review", color: "#FDBA74" },
    { id: "done", title: "Ready to test", color: "#F9A8D4" },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    const task = tasks.find((task) => task._id === activeId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping over a task, find its container
    const activeContainer = active.data.current?.sortable?.containerId;
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (activeContainer !== overContainer) {
      moveTask(activeId, overContainer as string);
    }

    setActiveTask(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>

      {/* Task Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onComplete={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={getTasksByStatus(column.id).map((task) => task._id)}
            >
              <KanbanColumn
                title={column.title}
                status={column.id}
                tasks={getTasksByStatus(column.id)}
                color={column.color}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
