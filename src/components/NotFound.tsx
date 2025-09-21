import { Link } from "@tanstack/react-router";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export function NotFound({ children }: { children?: any }) {
  const { trackPageView, trackButtonClick } = usePostHogTracking();
  
  // Track 404 page view
  trackPageView({ page: "not_found" });
  
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            trackButtonClick("not_found_go_back");
            window.history.back();
          }}
          className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          Go back
        </button>
        <Link
          to="/"
          className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
