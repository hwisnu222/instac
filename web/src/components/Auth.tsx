import { swrFetcher } from "@/utils/swrFether";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import useSWR from "swr";
import Loading from "./Loading";

export const Auth = () => {
  const navigate = useNavigate();

  const { error, isLoading } = useSWR("/auth/users/me", swrFetcher);

  // Redirect logic harus di dalam effect
  useEffect(() => {
    if (!isLoading && error) {
      localStorage.setItem("@token", "");
      navigate("/auth/login", { replace: true });
    }
  }, [isLoading, error, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};
