import {
  isRouteErrorResponse,
  Links,
  Meta,
  Navigate,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
 
 import Navbar from "./components/Navbar";
 import { useAuthStore } from "./store/useAuthStore";
 import { useThemeStore } from "./store/useThemeStore";
import type { Route } from "./+types/root";
import "./app.css";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const {theme} = useThemeStore();
  return (
    <html data-theme={theme}  lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
 const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
 const {theme} = useThemeStore();
 useEffect(() =>{
   checkAuth()
 } , [checkAuth])
 console.log("Auth user", authUser);
 if(isCheckingAuth && !authUser) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  )
 }
  return <div data-theme={theme} className="min-h-screen bg-base-200"> 
    <div>
    {
      authUser ? <Navbar />   : <Navigate to="/login" replace />
    }
    </div>
    <Toaster />
    <Outlet />
  </div>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
