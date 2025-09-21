import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("auth_layout_page");
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center">
      <main className="min-w-lg">
        <Outlet />
      </main>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center">
      <main className="min-w-lg text-center space-y-4">
        <h1 className="text-2xl font-bold">Authentication Page Not Found</h1>
        <p className="text-muted-foreground">
          The authentication page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go to Login
          </Link>
          <Link 
            to="/auth/register" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Go to Register
          </Link>
        </div>
      </main>
    </div>
  );
}
