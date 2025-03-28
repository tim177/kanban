"use client";

import { create } from "zustand";
import type { Task, TaskInput } from "./types";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: string, task: Partial<TaskInput>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      set({ tasks: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTask: async (taskInput: TaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskInput),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const newTask = await response.json();
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTask: async (id: string, taskUpdate: Partial<TaskInput>) => {
    // Find the task to be updated
    const taskToUpdate = get().tasks.find((task) => task._id === id);

    if (!taskToUpdate) return;

    // Optimistically update the UI
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, ...taskUpdate } : task
      ),
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      // Update with the server response
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      // Revert to the original state if there's an error
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? taskToUpdate : task
        ),
        error: (error as Error).message,
      }));
    }
  },

  deleteTask: async (id: string) => {
    // Store the task to be deleted for potential recovery
    const taskToDelete = get().tasks.find((task) => task._id === id);

    // Optimistically update the UI
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      // Revert the deletion if there's an error
      if (taskToDelete) {
        set((state) => ({
          tasks: [...state.tasks, taskToDelete],
          error: (error as Error).message,
        }));
      }
    }
  },

  moveTask: async (id: string, newStatus: string) => {
    // Find the task to be updated
    const taskToUpdate = get().tasks.find((task) => task._id === id);

    if (!taskToUpdate) return;

    // Optimistically update the UI
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id ? { ...task, status: newStatus } : task
      ),
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to move task");
      }

      const updatedTask = await response.json();

      // Update with the server response
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      // Revert to the original state if there's an error
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? taskToUpdate : task
        ),
        error: (error as Error).message,
      }));
    }
  },
}));
