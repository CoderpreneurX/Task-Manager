"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "@/utils/api";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProtectedRoute from "@/components/protectedRoute";

interface TaskData {
  title: string;
  description: string;
  status: "pending" | "completed";
}

export default function EditTaskPage() {
  const [loading, setLoading] = useState(true); // Start with loading=true
  const [taskNotFound, setTaskNotFound] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const { register, handleSubmit, setValue, watch } = useForm<TaskData>();

  const onUpdate = async (data: TaskData) => {
    setLoading(true);
    try {
      await API.patch(`/tasks/${taskId}`, data);
      toast.success("Task updated successfully!", { duration: 5000 });
      router.push("/tasks"); // ✅ Navigate back to the tasks page
    } catch (err) {
      console.error("Update Task Error:", err);
      toast.error("Failed to update task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId) {
      setTaskNotFound(true);
      return;
    }

    const fetchTask = async () => {
      try {
        const { data } = await API.get(`/tasks/${taskId}`);
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("status", data.status);
      } catch (err: any) {
        if (err.error === "Task not found") {
          setTaskNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, setValue]);

  // 🚀 Show 404 page instantly if task is not found
  if (taskNotFound) {
    return notFound();
  }

  // ⏳ Show nothing while loading to avoid flicker
  if (loading) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Update the task details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onUpdate)}
              className="space-y-6"
            >
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: true })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
