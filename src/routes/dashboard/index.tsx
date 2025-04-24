import React from "react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "@tanstack/react-router";

function index() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <div>Dashboard Page</div>;
}

export default index;
