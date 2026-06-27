import { createBrowserRouter } from "react-router";

import AppLayout from "./pages/_layouts/app";
import AuthLayout from "./pages/_layouts/auth";
import { AccountDetails } from "./pages/account/account-details";
import { Dashboard } from "./pages/app/dashboard";
import { ForgotPassword } from "./pages/auth/forgot-password";
import { ResetPassword } from "./pages/auth/reset-password";
import { SignIn } from "./pages/auth/sign-in";
import { Clients } from "./pages/clients/clients";
import { DelinquentClients } from "./pages/clients/delinquent-clients";
import { LandingPage } from "./pages/landing/landing-page";
import { UserManual } from "./pages/app/user-manual";
import { AdminDashboard } from "./pages/admin/admin-dashboard";
import { SignUp } from "./pages/auth/sign-up";

export const router = createBrowserRouter([
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/account", element: <AccountDetails /> },
      { path: "/clients", element: <Clients /> },
      { path: "/delinquent-clients", element: <DelinquentClients /> },
      { path: "/manual", element: <UserManual /> },
      { path: "/admin", element: <AdminDashboard /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
]);
