import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "@/integrations/better-auth/client";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";
import { Confetti } from "@/components/magic-ui/confetti";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      success: typeof search.success === "string" ? search.success : undefined,
      customer_session_token: typeof search.customer_session_token === "string" ? search.customer_session_token : undefined,
      plan: typeof search.plan === "string" ? search.plan : undefined,
    };
  },
});

function RouteComponent() {
  const { data: session } = useSession();
  const search = Route.useSearch();
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Check if we should celebrate - either success=true or customer_session_token present
    const shouldCelebrate = search.success === "true" || search.customer_session_token;
    
    if (shouldCelebrate) {
      // Trigger confetti celebration
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 500);

      // Force refresh subscription data by reloading the page
      // This ensures the subscription state is updated after payment
      setTimeout(() => {
        // Clean up the URL by removing success, customer_session_token, and plan parameters
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        url.searchParams.delete("customer_session_token");
        url.searchParams.delete("plan");
        window.history.replaceState({}, "", url.toString());
        
        // Force page reload to refresh subscription data
        window.location.reload();
      }, 2000);
    }
  }, [search.success, search.customer_session_token]);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Confetti celebration for successful subscription */}
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-50 size-full pointer-events-none"
        manualstart={true}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SubscriptionBadge />
          <Button asChild variant="outline">
            <Link to="/dashboard/settings">Settings</Link>
          </Button>
          <Button onClick={() => signOut()}>Logout</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <SubscriptionBadge />
              </div>
              <div className="flex justify-between">
                <span>Email Verified:</span>
                <Badge
                  variant={
                    session?.user?.emailVerified ? "default" : "secondary"
                  }
                >
                  {session?.user?.emailVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/dashboard/settings">Manage Subscription</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/pricing">View Plans</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Resources and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/help">Help Center</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {process.env.NODE_ENV === "development" && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>Session data for development</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-muted p-4 rounded">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
