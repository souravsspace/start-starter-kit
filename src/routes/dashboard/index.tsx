import { Confetti } from "@/components/magic-ui/confetti";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	sendVerificationEmail,
	signOut,
	useSession,
} from "@/integrations/better-auth/client";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			success: typeof search.success === "string" ? search.success : undefined,
			customer_session_token:
				typeof search.customer_session_token === "string"
					? search.customer_session_token
					: undefined,
			plan: typeof search.plan === "string" ? search.plan : undefined,
		};
	},
});

function RouteComponent() {
	const { data: session } = useSession();
	const navigate = useNavigate();
	const search = Route.useSearch();
	const confettiRef = useRef<any>(null);
	const [isSendingEmail, setIsSendingEmail] = useState(false);
	const {
		trackEvent,
		trackButtonClick,
		identifyUser,
		trackConversion,
		trackPageView,
	} = usePostHogTracking();

	const handleSendVerificationEmail = async () => {
		if (!session?.user?.email) return;

		trackButtonClick("send_verification_email");
		setIsSendingEmail(true);
		try {
			await sendVerificationEmail({ email: session.user.email });
			trackEvent("verification_email_sent", { email: session.user.email });
			toast.success("Verification email sent! Please check your inbox.");
			// Navigate to verification page using TanStack router
			navigate({ to: "/auth/verify-email" });
		} catch (error) {
			trackEvent("verification_email_failed", {
				email: session.user.email,
				error: error instanceof Error ? error.message : "unknown",
			});
			console.error(
				"Failed to send verification email to",
				session.user.email,
				":",
				error,
			);
			toast.error("Failed to send verification email. Please try again.");
			setIsSendingEmail(false);
		}
	};

	useEffect(() => {
		// Track page view
		trackPageView({ page: "dashboard" });

		// Identify user if session exists
		if (session?.user?.id && session?.user?.email) {
			identifyUser(session.user.id, {
				email: session.user.email,
				name: session.user.name,
				emailVerified: session.user.emailVerified,
				plan: session.user.plan,
			});
		}

		// Check if we should celebrate - either success=true or customer_session_token present
		const shouldCelebrate =
			search.success === "true" || search.customer_session_token;

		if (shouldCelebrate) {
			// Track successful subscription conversion
			trackConversion("subscription_purchase", undefined, {
				plan: search.plan,
				success: search.success,
				hasCustomerSession: !!search.customer_session_token,
			});

			// Trigger confetti celebration
			setTimeout(() => {
				confettiRef.current?.fire({
					particleCount: 150,
					spread: 70,
					origin: { y: 0.6 },
				});
			}, 500);

			// Force refresh subscription data by reloading the page
			// This ensures the subscription state is updated after payment
			setTimeout(() => {
				// Clean up the URL by removing success, customer_session_token, and plan parameters
				navigate({ to: "/dashboard", search: {}, replace: true });

				// Force refresh subscription data by reloading the page
				setTimeout(() => {
					navigate({ to: "/dashboard", replace: true });
				}, 2000);
			}, 2000);
		}
	}, [search.success, search.customer_session_token, session]);

	return (
		<div className="mx-auto max-w-7xl p-6 space-y-6">
			{/* Confetti celebration for successful subscription */}
			<Confetti
				ref={confettiRef}
				className="absolute left-0 top-0 z-50 size-full pointer-events-none"
				manualstart={true}
			/>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session?.user?.name || session?.user?.email}
					</p>
				</div>
				<div className="flex items-center gap-4">
					<SubscriptionBadge />
					<Button
						asChild
						variant="outline"
						onClick={() => trackButtonClick("dashboard_navigation_settings")}
					>
						<Link to="/dashboard/settings">Settings</Link>
					</Button>
					<Button
						onClick={() => {
							trackButtonClick("logout_button");
							signOut();
						}}
					>
						Logout
					</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Account Status</CardTitle>
						<CardDescription>Your current account information</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Email:</span>
								<span className="font-medium">{session?.user?.email}</span>
							</div>
							<div className="flex justify-between">
								<span>Plan:</span>
								<SubscriptionBadge />
							</div>
							<div className="flex justify-between items-center gap-2">
								<span>Email Verified:</span>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											session?.user?.emailVerified ? "default" : "secondary"
										}
									>
										{session?.user?.emailVerified ? "Verified" : "Pending"}
									</Badge>
									{!session?.user?.emailVerified && (
										<Button
											size="sm"
											variant="outline"
											onClick={handleSendVerificationEmail}
											disabled={isSendingEmail}
										>
											{isSendingEmail ? "Sending..." : "Verify Email"}
										</Button>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common tasks and shortcuts</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button 
							asChild 
							className="w-full" 
							onClick={() => trackButtonClick("dashboard_quick_manage_subscription")}
						>
							<Link to="/dashboard/settings">Manage Subscription</Link>
						</Button>
						<Button 
							asChild 
							variant="outline" 
							className="w-full"
							onClick={() => trackButtonClick("dashboard_quick_view_plans")}
						>
							<Link to="/pricing">View Plans</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Need Help?</CardTitle>
						<CardDescription>Resources and support</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button 
							asChild 
							variant="outline" 
							className="w-full"
							onClick={() => trackButtonClick("dashboard_help_center")}
						>
							<Link to="/help">Help Center</Link>
						</Button>
						<Button 
							asChild 
							variant="outline" 
							className="w-full"
							onClick={() => trackButtonClick("dashboard_contact_support")}
						>
							<Link to="/contact">Contact Support</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{process.env.NODE_ENV === "development" && (
				<Card>
					<CardHeader>
						<CardTitle>Debug Information</CardTitle>
						<CardDescription>Session data for development</CardDescription>
					</CardHeader>
					<CardContent>
						<pre className="text-xs overflow-auto bg-muted p-4 rounded">
							{JSON.stringify(session, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
