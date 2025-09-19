import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/pricing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="pt-24 md:pt-36 mx-auto max-w-7xl px-6">
      Hello "/_marketing/pricing"!
    </div>
  );
}
