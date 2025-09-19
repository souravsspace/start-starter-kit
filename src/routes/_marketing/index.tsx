import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/marketing/hero-sesion";
import { FAQs } from "@/components/marketing/faq";

export const Route = createFileRoute("/_marketing/")({
  component: App,
});

function App() {
  return (
    <>
      <HeroSection />
      <FAQs />
    </>
  );
}
