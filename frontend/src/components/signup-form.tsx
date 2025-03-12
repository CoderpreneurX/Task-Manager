"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner"; // Import Sonner's toast
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

interface SignupData {
  email: string;
  password: string;
}

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Validate token with a call to the backend
      API.post("/auth/validate-token/", { token })
        .then(() => {
          router.push("/"); // Redirect to tasks if the token is valid
        })
        .catch(() => {
          localStorage.removeItem("token"); // Remove invalid token from localStorage
          // router.push("/login"); // Redirect to login page if the token is invalid
        });
    }
  }, [router]);

  const { register, handleSubmit } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    setLoading(true);

    try {
      await API.post("/auth/register", data);
      toast.success("Registration Successful! Redirecting..."); // Sonner success toast
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message); // Sonner error toast for Error objects
      } else if (err && typeof err === "object" && "message" in err) {
        // If it's a JSON object with a "message" property
        const { message } = err as { message: string }; // Type assertion for JSON object
        toast.error(message); // Sonner error toast for JSON object with "message"
      } else {
        toast.error("An unexpected error occurred."); // Fallback message
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ""}`} {...props}>
      <Toaster position="top-right" />
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-3">
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a onClick={() => {router.push('/login')}} className="underline cursor-pointer underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
