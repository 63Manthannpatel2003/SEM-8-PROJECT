import { useState } from "react";
import { mockTasks, mockProjects } from "@/lib/mock-data";
import { Task, Project } from "@shared/schema";
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

export default function Tasks() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTimer = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "in_progress" } 
        : task
    ));
    toast({
      title: "Timer started",
      description: "The timer has been started for this task.",
    });
  };

  const handleStopTimer = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === "in_progress" ? "completed" : task.status } 
        : task
    ));
    toast({
      title: "Timer stopped",
      description: "The timer has been stopped for this task.",
    });
  };

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

  const filteredTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject)
    : tasks;

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
            {mockProjects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
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
              {task.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (task.status === "in_progress") {
                      handleStopTimer(task.id);
                    } else {
                      handleStartTimer(task.id);
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

      {selectedProject && filteredTasks.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No tasks found for this project
        </div>
      )}
    </div>
  );
}