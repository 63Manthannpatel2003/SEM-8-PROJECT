import { Project, Task, TimeEntry } from "@shared/schema";

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Building a modern e-commerce platform with React and Node.js",
    managerId: 1,
  },
  {
    id: 2,
    name: "Mobile App",
    description: "Developing a cross-platform mobile application",
    managerId: 1,
  },
  {
    id: 3,
    name: "CRM System",
    description: "Customer relationship management system for internal use",
    managerId: 2,
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    title: "User Authentication",
    description: "Implement user authentication system",
    assignedTo: 1,
    status: "completed",
    estimatedHours: 8,
  },
  {
    id: 2,
    projectId: 1,
    title: "Shopping Cart",
    description: "Build shopping cart functionality",
    assignedTo: 2,
    status: "in_progress",
    estimatedHours: 16,
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    startTime: new Date("2024-02-19T09:00:00"),
    endTime: new Date("2024-02-19T17:00:00"),
    description: "Implemented user authentication flow",
  },
  {
    id: 2,
    taskId: 2,
    userId: 2,
    startTime: new Date("2024-02-19T10:00:00"),
    endTime: null,
    description: "Working on shopping cart features",
  },
];
