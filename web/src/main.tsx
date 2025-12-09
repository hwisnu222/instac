import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-photo-view/dist/react-photo-view.css";
import App from "./App.tsx";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "./components/ui/toaster.tsx";
import { PhotoProvider } from "react-photo-view";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/auth/Login.tsx";
import { Auth } from "./components/Auth.tsx";
import Register from "./pages/auth/Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider forcedTheme="dark">
      <PhotoProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PhotoProvider>
    </Provider>
  </StrictMode>,
);
