import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthLayout from "./pages/AuthLayout/AuthLayoutPage";
import SignUpPage from "./pages/SignUp/SignUpPage.jsx";
import SignInPage from "./pages/SignIn/SignInPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Layout from "./components/Layout";
import CreationPage from "./pages/Creation/CreationPage";
import { DataContextProvider } from "./contexts/DataContext";
import { protectedRouteLoader, publicRouteLoader } from "./services/auth";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="animate-spin" size={18} />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/signup" replace />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    loader: publicRouteLoader,
    children: [
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    loader: protectedRouteLoader,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "creation-tool",
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
    <DataContextProvider>
      <Toaster position="top-center" />
      <RouterProvider
        router={router}
        fallbackElement={<LoadingFallback />}
        hydrationData={{}}
      />
    </DataContextProvider>
  </StrictMode>,
);
