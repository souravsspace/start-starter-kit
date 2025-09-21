import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("dashboard_settings_page");
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>
      
      <SubscriptionManager />
    </div>
  );
}