import { swrFetcher } from "@/utils/swrFether";
import { Outlet, useNavigate } from "react-router";
import useSWR from "swr";

export const Auth = () => {
  const navigate = useNavigate();

  const { error, isLoading } = useSWR("/auth/users/me", swrFetcher);

  if (isLoading) <p>loading</p>;
  if (!isLoading && error) {
    localStorage.setItem("@token", "");
    navigate("/auth/login");
    return;
  }

  return <Outlet />;
};
