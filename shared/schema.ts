import { z } from "zod";

export type UserRole = "admin" | "project_manager" | "developer";

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  managerId: number;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  assignedTo: number;
  status: string;
  estimatedHours: number | null;
}

export interface TimeEntry {
  id: number;
  taskId: number;
  userId: number;
  startTime: Date;
  endTime: Date | null;
  description: string | null;
}

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "project_manager", "developer"]).default("developer"),
});

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullable(),
  managerId: z.number(),
});

export const insertTaskSchema = z.object({
  projectId: z.number(),
  title: z.string().min(1, "Task title is required"),
  description: z.string().nullable(),
  assignedTo: z.number(),
  status: z.string(),
  estimatedHours: z.number().nullable(),
});

export const insertTimeEntrySchema = z.object({
  taskId: z.number(),
  userId: z.number(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  description: z.string().nullable(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;

export type User = User;
export type Project = Project;
export type Task = Task;
export type TimeEntry = TimeEntry;