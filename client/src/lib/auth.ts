import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface AdminUser {
  id: string;
  username: string;
}

export function useAdminAuth(redirectTo = "/admin/login") {
  const [, navigate] = useLocation();
  
  const { data, isLoading, error } = useQuery<{ ok: boolean; admin: AdminUser }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const isAuthenticated = data?.ok === true;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isLoading, isAuthenticated, navigate, redirectTo]);

  return {
    admin: data?.admin,
    isAuthenticated,
    isLoading,
    error,
  };
}
