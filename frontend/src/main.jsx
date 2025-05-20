import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AuthLayout from "./pages/AuthLayout/AuthLayoutPage";
import SignUpPage from "./pages/SignUp/SignUpPage.jsx";
import SignInPage from "./pages/SignIn/SignInPage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Layout from "./components/Layout";
import CreationPage from "./pages/Creation/CreationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/signup" replace />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "signup", element: <SignUpPage /> },
      { path: "signin", element: <SignInPage /> },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/creation-tool",
        element: <CreationPage />,
      },
      // {
      //   path: "/profile",
      //   element: <UserAccountPage />,
      // },
      // {
      //   path: "/profile/edit",
      //   element: <EditUserAccount />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </StrictMode>,
);
