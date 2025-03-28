export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  points?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  status: string;
  priority: string;
  points?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
