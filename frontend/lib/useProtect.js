import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

// Redirects to login if not authenticated, or to their own dashboard
// if they hit a page that requires a different role.
export function useProtect(requiredRole = null) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/employee");
    }
  }, [user, loading, requiredRole]);

  return { user, loading };
}
