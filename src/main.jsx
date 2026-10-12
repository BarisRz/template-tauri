import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";

import App from "./App";
import Error from "./pages/Error";
import TrayApp from "./pages/TrayApp";

import Home from "./pages/Home";
import ColorSelect from "./components/ColorSelect";
import ColorWheel from "./components/ColorWheel";

const queryClient = new QueryClient();

// La mini-fenêtre du system tray partage le même bundle que la fenêtre principale
const isTrayWindow = getCurrentWindow().label === "tray";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/",
            element: <ColorSelect />,
          },
          {
            path: "/color-wheel",
            element: <ColorWheel />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    {isTrayWindow ? <TrayApp /> : <RouterProvider router={router} />}
  </QueryClientProvider>,
);
