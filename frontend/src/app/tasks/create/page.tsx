"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskData {
  title: string;
  description: string;
  status: "pending" | "completed";
}

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, reset, watch } = useForm<TaskData>({
    defaultValues: {
      status: "pending", // Default status
    },
  });

  const status = watch("status"); // Watch status to disable submit if empty

  const onSubmit = async (data: TaskData) => {
    setLoading(true);
    try {
      await API.post("/tasks", data);
      toast.success("Task created successfully!", { duration: 10000 });
      reset();
      router.push("/tasks");
    } catch (err) {
      console.error("Create Task Error:", err);
      toast.error("Failed to create task. Try again.", { duration: 10000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a New Task</CardTitle>
          <CardDescription>Fill in the details below to add a new task.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: true })} placeholder="Enter task title" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Enter task details" />
            </div>
            <div>
              <Label>Status</Label>
              <Select onValueChange={(value) => setValue("status", value as "pending" | "completed")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !status}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
