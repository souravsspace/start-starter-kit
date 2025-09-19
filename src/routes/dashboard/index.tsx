import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/integrations/better-auth/client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = useSession();

	return (
		<div>
			<h2>Hello "/demo/dashboard"!</h2>
			<code>{JSON.stringify(session, null, 2)}</code>

			<Button onClick={() => signOut()}>Logout</Button>
		</div>
	);
}
