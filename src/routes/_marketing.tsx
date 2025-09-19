import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
export const Route = createFileRoute("/_marketing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
