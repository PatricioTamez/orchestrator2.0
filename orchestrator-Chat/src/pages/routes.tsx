import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

//import useAuthContext from "@/hooks/useAuthContext";
import Login from "@/pages/login";
import SignUp from "@/pages/singin";
import ChatPage from "@/pages/chat/page"
import { useAuthContext } from "@/hooks/AuthContext";
import { Label } from "@radix-ui/react-label";
import { ReactNode } from "react";



const ReactRouterBrowser = () => {
  const {
    authState: { user, isAuthReady },
  } = useAuthContext();

  if (!isAuthReady) {
    return <Label>Loading...</Label>;
  }

  // Protected Route: Ensures only authenticated users can access
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Public Route: Redirects authenticated users to Chat
  const PublicRoute = ({ children }: { children: ReactNode }) => {
    if (user) {
      return <Navigate to="/home" replace />;
    }
    return <>{children}</>;
  };

  // Define the routes
  const browserRoutes: RouteObject[] = [
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
  ];

  // Create the router
  const router = createBrowserRouter(browserRoutes);

  return <RouterProvider router={router} />;
};

export default ReactRouterBrowser;
