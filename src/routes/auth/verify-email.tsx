import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/integrations/better-auth/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/verify-email")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search.token === "string" ? search.token : undefined,
      email: typeof search.email === "string" ? search.email : undefined,
    };
  },
});

function RouteComponent() {
  const { data: session, refetch: refetchSession } = useSession();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if user is authenticated
        if (!session) {
          navigate({ to: "/auth/login" });
          return;
        }

        // Check if email is already verified
        if (session.user?.emailVerified) {
          navigate({ to: "/dashboard" });
          return;
        }

        // Poll for email verification status
        const checkInterval = setInterval(async () => {
          const updatedSession = await refetchSession();

          if (updatedSession.data?.user?.emailVerified) {
            clearInterval(checkInterval);
            setIsLoading(false);
            navigate({ to: "/dashboard" });
          }
        }, 3000);

        // Stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(checkInterval);
          setIsLoading(false);
          setError(
            "Verification timeout. Please check your email and try again.",
          );
        }, 300000);

        return () => clearInterval(checkInterval);
      } catch (err) {
        setError("Failed to verify email. Please try again.");
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [session, refetchSession, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying Your Email
            </CardTitle>
            <CardDescription>
              Please check your email and click the verification link
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary">Checking verification status...</Badge>
              <p className="text-sm text-muted-foreground">
                This page will automatically redirect you once your email is
                verified.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/auth/verify-email", replace: true })}
              >
                Try Again
              </Button>
              <Button onClick={() => navigate({ to: "/dashboard" })}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
