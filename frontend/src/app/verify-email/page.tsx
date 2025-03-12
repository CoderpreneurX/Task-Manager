"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import { toast } from "sonner";
import API from "@/utils/api"; // Assuming you have an API utility
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";

interface VerifyEmailResponse {
  message: string;
}

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationFailed, setVerificationFailed] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  useEffect(() => {
    if (!email || !code) {
      setVerificationFailed(true);
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      try {
        const { data }: { data: VerifyEmailResponse } = await API.post(
          "/auth/verify-email",
          { email, code }
        );
        toast.success(data.message, { duration: 5000 });
        router.replace("/login"); // Redirect to login page after successful verification
      } catch (err: any) {
        toast.error(
          "Verification failed. The code might be expired or invalid.",
          { duration: 5000 }
        );
        setVerificationFailed(true);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [email, code, router]);

  // 🚀 Show 404 page instantly if email or code is missing
  if (verificationFailed) {
    return notFound();
  }

  // ⏳ Show nothing while loading to avoid flicker
  if (loading) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              We&pos;re verifying your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <p>
                {loading
                  ? "Verifying your email..."
                  : "Please wait while we verify your email address."}
              </p>
              <Button
                type="button"
                className="w-full"
                onClick={() => router.replace("/login")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Go to Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
