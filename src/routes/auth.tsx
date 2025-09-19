import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center">
      <main className="min-w-lg">
        <Outlet />
      </main>
    </div>
  );
}
