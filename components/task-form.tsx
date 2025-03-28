"use client";

import type React from "react";

import { useState } from "react";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  task?: Task;
  defaultStatus?: string;
  onComplete?: () => void;
}

export default function TaskForm({
  task,
  defaultStatus = "todo",
  onComplete,
}: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore();

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || defaultStatus,
    points: task?.points || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      points: formData.points
        ? Number.parseInt(formData.points as string)
        : undefined,
    };

    if (task) {
      updateTask(task._id, taskData);
    } else {
      addTask(taskData);
    }

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: defaultStatus,
      points: "",
    });

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Input
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            className="text-sm focus-visible:ring-blue-500"
            autoFocus
          />
          <Textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="text-sm min-h-[80px] resize-none focus-visible:ring-blue-500"
          />
          <Input
            name="points"
            placeholder="Points (optional)"
            value={formData.points}
            onChange={handleChange}
            type="number"
            min="0"
            className="text-sm focus-visible:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex w-full justify-between gap-3">
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger className="text-sm h-9 w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="text-sm h-9 w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="w-full">
              {task ? "Update" : "Add"} Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
