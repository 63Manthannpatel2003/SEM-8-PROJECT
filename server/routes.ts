import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProjectSchema, insertTaskSchema, insertTimeEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Projects
  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user!;
    if (user.role !== "project_manager" && user.role !== "admin") {
      return res.sendStatus(403);
    }

    const parsed = insertProjectSchema.safeParse({
      ...req.body,
      description: req.body.description || null,
    });
    if (!parsed.success) return res.status(400).json(parsed.error);

    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  // Tasks
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasks(Number(req.params.projectId));
    res.json(tasks);
  });

  app.post("/api/projects/:projectId/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user!;
    if (user.role !== "project_manager" && user.role !== "admin") {
      return res.sendStatus(403);
    }

    const parsed = insertTaskSchema.safeParse({
      ...req.body,
      projectId: Number(req.params.projectId),
      description: req.body.description || null,
      estimatedHours: req.body.estimatedHours || null,
    });
    if (!parsed.success) return res.status(400).json(parsed.error);

    const task = await storage.createTask(parsed.data);
    res.status(201).json(task);
  });

  // Time entries
  app.post("/api/tasks/:taskId/time", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertTimeEntrySchema.safeParse({
      ...req.body,
      taskId: Number(req.params.taskId),
      userId: req.user!.id,
      startTime: new Date(),
      endTime: null,
      description: req.body.description || null,
    });
    if (!parsed.success) return res.status(400).json(parsed.error);

    const entry = await storage.createTimeEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.patch("/api/time/:timeId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entry = await storage.updateTimeEntry(
      Number(req.params.timeId),
      new Date()
    );
    res.json(entry);
  });

  const httpServer = createServer(app);
  return httpServer;
}