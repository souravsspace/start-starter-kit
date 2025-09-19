import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/marketing/hero-sesion";

export const Route = createFileRoute("/_marketing/")({
  component: App,
});

function App() {
  return (
    <>
      <HeroSection />
    </>
  );
}
