import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;
  return <div>Dashboard Page</div>;
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});
