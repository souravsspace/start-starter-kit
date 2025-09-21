import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/marketing/hero-sesion";
import { FAQs } from "@/components/marketing/faq";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export const Route = createFileRoute("/_marketing/")({
  component: App,
});

function App() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("home_page");
  return (
    <>
      <HeroSection />
      <FAQs />
    </>
  );
}
