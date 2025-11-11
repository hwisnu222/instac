import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-photo-view/dist/react-photo-view.css";
import App from "./App.tsx";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "./components/ui/toaster.tsx";
import { PhotoProvider } from "react-photo-view";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider forcedTheme="dark">
      <PhotoProvider>
        <App />
        <Toaster />
      </PhotoProvider>
    </Provider>
  </StrictMode>,
);
