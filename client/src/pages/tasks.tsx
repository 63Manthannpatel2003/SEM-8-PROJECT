import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Task, TimeEntry, Project } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Square, Clock } from "lucide-react";
import { useState } from "react";

export default function Tasks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/projects", selectedProject, "tasks"],
    enabled: !!selectedProject,
  });

  const startTimeEntry = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await apiRequest("POST", `/api/tasks/${taskId}/time`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Time tracking started",
        description: "The timer has been started for this task.",
      });
    },
  });

  const stopTimeEntry = useMutation({
    mutationFn: async (timeId: number) => {
      const res = await apiRequest("PATCH", `/api/time/${timeId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Time tracking stopped",
        description: "The timer has been stopped for this task.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-secondary";
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Select
          value={selectedProject?.toString()}
          onValueChange={(value) => setSelectedProject(Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <Card key={task.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{task.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description || "No description provided"}
                </p>
              </div>
              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {task.estimatedHours} hours estimated
              </div>
              {task.assignedTo === user?.id && task.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (task.status === "in_progress") {
                      // Mock time entry ID for demo
                      stopTimeEntry.mutate(1);
                    } else {
                      startTimeEntry.mutate(task.id);
                    }
                  }}
                >
                  {task.status === "in_progress" ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Timer
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Timer
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {!selectedProject && (
        <div className="text-center text-muted-foreground py-8">
          Select a project to view its tasks
        </div>
      )}

      {selectedProject && tasks?.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No tasks found for this project
        </div>
      )}
    </div>
  );
}
