"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Define Zod Schema for validation
const signupSchema = z.object({
  full_name: z.string().min(4, "Full name must be atleast 4 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[\W_]/, "Password must include a special character"),
});

type SignupData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Validate token with a call to the backend
      API.post("/auth/validate-token/", { token })
        .then(() => {
          router.replace("/"); // Redirect if the token is valid
        })
        .catch(() => {
          localStorage.removeItem("token"); // Remove invalid token
        });
    }
  }, [router]);

  // Use react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    setLoading(true);

    try {
      await API.post("/auth/register", data);
      toast.success("Registration Successful! Redirecting...");
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (err && typeof err === "object" && "message" in err) {
        const { message } = err as { message: string };
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
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
            Enter your email below to sign up for an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="email">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Morty Davidson"
                  {...register("full_name")}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm">{errors.full_name.message}</p>
                )}
              </div>
              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing up..." : "Sign up"}
                </Button>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                onClick={() => {
                  router.replace("/login");
                }}
                className="underline cursor-pointer underline-offset-4"
              >
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
