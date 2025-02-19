import { users, projects, tasks, timeEntries, type User, type Project, type Task, type TimeEntry, type InsertUser, type InsertTask, type InsertTimeEntry } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: { name: string; description: string | null; managerId: number }): Promise<Project>;

  // Task operations
  getTasks(projectId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: { projectId: number; title: string; description: string | null; assignedTo: number; status: string; estimatedHours: number | null }): Promise<Task>;
  updateTaskStatus(id: number, status: string): Promise<Task>;

  // Time entry operations
  getTimeEntries(taskId: number): Promise<TimeEntry[]>;
  createTimeEntry(entry: { taskId: number; userId: number; startTime: Date; endTime: Date | null; description: string | null }): Promise<TimeEntry>;
  updateTimeEntry(id: number, endTime: Date): Promise<TimeEntry>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: { name: string; description: string | null; managerId: number }): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getTasks(projectId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: { projectId: number; title: string; description: string | null; assignedTo: number; status: string; estimatedHours: number | null }): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async getTimeEntries(taskId: number): Promise<TimeEntry[]> {
    return db.select().from(timeEntries).where(eq(timeEntries.taskId, taskId));
  }

  async createTimeEntry(entry: { taskId: number; userId: number; startTime: Date; endTime: Date | null; description: string | null }): Promise<TimeEntry> {
    const [newEntry] = await db.insert(timeEntries).values(entry).returning();
    return newEntry;
  }

  async updateTimeEntry(id: number, endTime: Date): Promise<TimeEntry> {
    const [updatedEntry] = await db
      .update(timeEntries)
      .set({ endTime })
      .where(eq(timeEntries.id, id))
      .returning();
    return updatedEntry;
  }
}

export const storage = new DatabaseStorage();