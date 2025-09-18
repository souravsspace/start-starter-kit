import { useSession } from "@/integrations/better-auth/client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();

  console.log("SESSION: ", session);

  return (
    <div>
      <h2>Hello "/demo/dashboard"!</h2>
      <code>{JSON.stringify(session, null, 2)}</code>
    </div>
  );
}
