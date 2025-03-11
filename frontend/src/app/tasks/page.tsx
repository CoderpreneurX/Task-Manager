"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import API from "@/utils/api";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/protectedRoute";
import ActionMenu from "@/components/ui/actionMenu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get("/tasks");
        console.log("API Response:", response.data);
        setTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchParams.get("taskAdded") === "true") {
      toast.success("Task added successfully! 🎉");
    }
  }, [searchParams]);

  const handleEdit = (task: Task) => {
    router.push(`/tasks/edit?taskId=${task.id}`);
  };

  const handleMarkAsComplete = async (task: Task) => {
    console.log(`Marking ${task}`)
    const taskStatus = task.status === "completed" ? "pending" : "completed"
    try {
      await API.patch(`/tasks/${task.id}/status/`, { status: taskStatus});

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...task, status: taskStatus } : t
        )
      );

      toast.success(`Task marked as ${taskStatus}! ✅`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to mark task as completed.");
    }
  };

  const handleDelete = async (task: Task) => {
    try {
      await API.delete(`/tasks/${task.id}`);

      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));

      toast.success("Task deleted successfully! 🗑️");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center min-h-screen p-6 w-full">
        <Toaster position="top-right" />

        <div className="w-full max-w-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">My Tasks</h2>
            <Button onClick={() => router.push("/tasks/create")}>
              + Add Task
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks found.</p>
              ) : (
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                      <Button
                        variant={
                          task.status === "completed" ? "secondary" : "default"
                        }
                        onClick={() => handleMarkAsComplete(task)}
                        disabled={task.status === "completed"}
                      >
                        {task.status === "completed" ? "Completed" : "Pending"}
                      </Button>
                      <ActionMenu
                        task={task}
                        menuItems={[
                          { label: "Edit", action: handleEdit },
                          { label: task.status === "completed" ? "Mark as Pending" : "Mark as Completed", action: handleMarkAsComplete },
                          { label: "Delete", action: handleDelete },
                        ]}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
