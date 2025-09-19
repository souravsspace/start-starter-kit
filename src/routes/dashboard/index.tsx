import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "@/integrations/better-auth/client";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
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
                <Badge variant={session?.user?.emailVerified ? "default" : "secondary"}>
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
