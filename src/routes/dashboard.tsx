import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const userId = context.userId;
    if (!userId) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.pathname + location.search },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("dashboard_layout_page");
  return (
    <div>
      <Outlet />
    </div>
  );
}
