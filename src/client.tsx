import { StartClient } from "@tanstack/react-start";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(
	document,
	<StrictMode>
		<PostHogProvider
			apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
			options={{
				api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
				defaults: "2025-05-24",
				capture_exceptions: true,
				debug: false, // Disable debug logs in console
				loaded: (posthog) => {
					// Disable verbose logging
					posthog.set_config({
						verbose: false,
						debug: false,
					});
				},
			}}
		>
			<StartClient router={router} />
		</PostHogProvider>
	</StrictMode>,
);
