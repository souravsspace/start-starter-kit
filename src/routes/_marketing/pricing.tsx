import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { plans } from "convex/polar";
import { useAction, useQuery } from "convex/react";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_marketing/pricing")({
	component: RouteComponent,
});

function RouteComponent() {
	const subscriptionStatus = useQuery(api.polar.getSubscriptionStatus);
	const generateCheckoutLink = useAction(api.polar.generateCheckoutLink);
	const debugPolarConfig = useQuery(api.polar.debugPolarConfig);
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

	/**
	 * Handle checkout process for subscription plans
	 */
	const handleCheckout = async (plan: "professional" | "premiumLifetime") => {
		if (!subscriptionStatus?.isAuthenticated) {
			window.location.href = "/auth/login";
			return;
		}

		setLoadingPlan(plan);
		try {
			// Use configured product names from plans object
			const productIds =
				plan === "professional"
					? [plans.PROFESSIONAL_MONTHLY.name]
					: [plans.PROFESSIONAL_LIFETIME.name];

			const result = await generateCheckoutLink({
				productIds,
				origin: window.location.origin,
				successUrl: `${window.location.origin}/dashboard?success=true`,
			});

			if (result.url) {
				window.location.href = result.url;
			}
		} catch (error) {
			console.error("Checkout error:", error);
			alert(
				error instanceof Error ? error.message : "Failed to initiate checkout",
			);
		} finally {
			setLoadingPlan(null);
		}
	};

	const getButtonState = (plan: "professional" | "premiumLifetime") => {
		if (!subscriptionStatus?.isAuthenticated) {
			return { disabled: false, text: "Get Started" };
		}

		if (subscriptionStatus.currentPlan === plan) {
			return { disabled: true, text: "Current Plan" };
		}

		if (
			!subscriptionStatus.canUpgradeTo.includes(plan) &&
			!subscriptionStatus.canDowngradeTo.includes(plan)
		) {
			return { disabled: true, text: "Not Available" };
		}

		if (subscriptionStatus.canUpgradeTo.includes(plan)) {
			return { disabled: false, text: "Upgrade" };
		}
		if (subscriptionStatus.currentPlan === plan) {
			return { disabled: true, text: "Current Plan" };
		}

		if (
			!subscriptionStatus.canUpgradeTo.includes(plan) &&
			!subscriptionStatus.canDowngradeTo.includes(plan)
		) {
			return { disabled: true, text: "Not Available" };
		}

		if (subscriptionStatus.canUpgradeTo.includes(plan)) {
			return { disabled: false, text: "Upgrade" };
		}

		if (subscriptionStatus.canDowngradeTo.includes(plan)) {
			return { disabled: false, text: "Change Plan" };
		}

		return { disabled: false, text: "Get Started" };
	};
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				{/* Debug Info - Remove this in production */}
				{debugPolarConfig && (
					<div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm">
						<h3 className="font-semibold text-yellow-800 mb-2">🔧 Polar Debug Info</h3>
						<div className="space-y-1 text-yellow-700">
							<p><strong>User Authenticated:</strong> {debugPolarConfig.userAuthenticated ? '✅ Yes' : '❌ No'}</p>
							{debugPolarConfig.userAuthenticated && (
								<>
									<p><strong>User ID:</strong> {debugPolarConfig.userId}</p>
									<p><strong>Email:</strong> {debugPolarConfig.userEmail}</p>
								</>
							)}
							<p><strong>Polar Server:</strong> {debugPolarConfig.polarServer}</p>
							<p><strong>Expected Product IDs:</strong></p>
							<ul className="ml-4 space-y-1">
								<li>• Monthly: {debugPolarConfig.expectedProductIds.premiumMonthly}</li>
								<li>• Lifetime: {debugPolarConfig.expectedProductIds.premiumLifetime}</li>
							</ul>
						</div>
					</div>
				)}

				<div className="mx-auto max-w-2xl space-y-6 text-center">
					<h1 className="text-center text-4xl font-semibold lg:text-5xl">
						Simple, Transparent Pricing
					</h1>
					<p className="text-lg text-muted-foreground">
						Start for free, upgrade when you need more power. No hidden fees, no
						surprises.
					</p>
				</div>

				<div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
					<div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
						<div className="space-y-4">
							<div>
								<h2 className="font-medium">Starter</h2>
								<span className="my-3 block text-2xl font-semibold">
									$0 / mo
								</span>
								<p className="text-muted-foreground text-sm">
									Perfect for trying out our platform
								</p>
							</div>

							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									if (!subscriptionStatus?.isAuthenticated) {
										window.location.href = "/auth/register";
									}
								}}
							>
								Get Started
							</Button>

							<hr className="border-dashed" />

							<ul className="list-outside space-y-3 text-sm">
								{[
									"Core platform features",
									"Basic analytics & insights",
									"Community support",
									"1 project workspace",
									"Standard templates",
								].map((item) => (
									<li key={item} className="flex items-center gap-2">
										<Check className="size-3" />
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="space-y-4">
								<div>
									<div className="flex items-center gap-2">
										<h2 className="font-medium">Professional</h2>
										<span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
											Most Popular
										</span>
									</div>
									<span className="my-3 block text-2xl font-semibold">
										$5 / mo
									</span>
									<p className="text-muted-foreground text-sm">
										For professionals and growing teams
									</p>
								</div>

								<div className="space-y-2">
									<Button
										className="w-full"
										onClick={() => handleCheckout("professional")}
										disabled={
											getButtonState("professional").disabled ||
											loadingPlan === "professional"
										}
									>
										{loadingPlan === "professional" ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										{getButtonState("professional").text}
										{!getButtonState("professional").disabled && " - $5/mo"}
									</Button>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => handleCheckout("premiumLifetime")}
										disabled={
											getButtonState("premiumLifetime").disabled ||
											loadingPlan === "premiumLifetime"
										}
									>
										{loadingPlan === "premiumLifetime" ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : null}
										{getButtonState("premiumLifetime").text}
										{!getButtonState("premiumLifetime").disabled && " - $49"}
									</Button>
								</div>
							</div>

							<div>
								<div className="text-sm font-medium">
									Everything in Starter, plus:
								</div>

								<ul className="mt-4 list-outside space-y-3 text-sm">
									{[
										"Unlimited projects & workspaces",
										"Advanced analytics & reporting",
										"Priority email & chat support",
										"Custom integrations & API access",
										"100GB cloud storage",
										"Premium templates & assets",
										"Mobile apps for iOS & Android",
										"Team collaboration features",
										"Advanced security & compliance",
										"Custom branding options",
										"Early access to new features",
										"Priority bug fixes & support",
									].map((item) => (
										<li key={item} className="flex items-center gap-2">
											<Check className="size-3" />
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 text-center">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Still have questions?</h3>
						<p className="text-muted-foreground">
							Our team is here to help you choose the right plan for your needs.
						</p>
						<Button asChild variant="outline">
							<Link to="/contact">Contact Support</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
