"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/ui/sidebar";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get("/tasks");
        console.log("API Response:", response.data); // Debugging
        setTasks(response.data.tasks); // ✅ Extract 'tasks' array
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
      <div className="flex">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
          <div className="w-full max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
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
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            {task.description}
                          </p>
                        </div>
                        <Button
                          variant={
                            task.status === "completed" ? "secondary" : "default"
                          }
                        >
                          {task.status === "completed" ? "Completed" : "Pending"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}