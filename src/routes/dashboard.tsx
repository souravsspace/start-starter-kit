import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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
	return (
		<>
			<Outlet />
		</>
	);
}
