"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Validate token with a call to the backend
      API.post("/auth/validate-token", { token })
        .then((res: unknown) => {
          setLoading(false); // Allow access to the page if the token is valid
          console.log(res)
        })
        .catch(() => {
        //   localStorage.removeItem("token"); // Remove invalid token from localStorage
          router.push("/login"); // Redirect to login page if the token is invalid
        });
    } else {
      // If no token exists in localStorage, redirect to login page
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    // You can add a loading state here while validating the token
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>; // Render children (protected content) when authenticated
};

export default ProtectedRoute;
