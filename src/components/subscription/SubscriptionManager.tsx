import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import { api } from "convex/_generated/api";
import type { SubscriptionPlan } from "convex/polar";
import { useQuery } from "convex/react";
import { ExternalLink, Loader2, Check, X } from "lucide-react";
import { useState } from "react";

export function SubscriptionManager() {
  const {
    subscriptionStatus,
    isLoading,
    handlePlanChange,
    getPlanDisplayName,
    getPlanPrice,
    getCustomerPortalUrl,
  } = useSubscription();
  const { trackEvent, trackButtonClick, trackConversion } = usePostHogTracking();
  const subscriptionDetails = useQuery(api.polar.getSubscriptionDetails);
  const [customerPortalUrl, setCustomerPortalUrl] = useState<string | null>(null);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  // Handle loading and authentication states
  if (subscriptionStatus === undefined || subscriptionDetails === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            Loading subscription information...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus?.isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            Please log in to manage your subscription
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPlan = subscriptionStatus.currentPlan;
  const availablePlans: SubscriptionPlan[] = [
    "starter",
    "professional",
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Subscription Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Subscription
            {subscriptionDetails?.hasSubscription && (
              <Badge
                variant={
                  subscriptionDetails.isPremium ? "default" : "secondary"
                }
                className="flex items-center gap-1"
              >
                {subscriptionDetails.isPremium ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
                {getPlanDisplayName(currentPlan)} -{" "}
                {getPlanPrice(currentPlan)}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {currentPlan === "starter" &&
              "You're currently on the free Starter plan"}
            {currentPlan === "professional" &&
              "You're currently on the Professional monthly plan"}
          </CardDescription>
        </CardHeader>
        {subscriptionDetails?.error ? (
          <CardContent>
            <div className="text-red-600 bg-red-50 p-3 rounded-md">
              Error loading subscription details: {subscriptionDetails.error}
            </div>
          </CardContent>
        ) : subscriptionDetails?.hasSubscription ? (
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium ml-2">
                    <Badge
                      variant={
                        subscriptionDetails.status === "active"
                          ? "default"
                          : subscriptionDetails.status === "canceled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {subscriptionDetails.status}
                    </Badge>
                  </span>
                </div>
                {subscriptionDetails.amount && (
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium ml-2">
                      ${(subscriptionDetails.amount / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              {subscriptionDetails.currentPeriodStart && (
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium ml-2">
                    {new Date(
                      subscriptionDetails.currentPeriodStart,
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {subscriptionDetails.currentPeriodEnd && (
                <div>
                  <span className="text-muted-foreground">
                    {subscriptionDetails.cancelAtPeriodEnd
                      ? "Expires on:"
                      : "Next billing:"}
                  </span>
                  <span className="font-medium ml-2">
                    {new Date(
                      subscriptionDetails.currentPeriodEnd,
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {subscriptionDetails.cancelAtPeriodEnd && (
                <div className="text-orange-600 bg-orange-50 p-3 rounded-md">
                  ⚠️ Your subscription will cancel at the end of the current
                  billing period
                </div>
              )}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="text-muted-foreground">
              No active subscription found. You're on the free Starter plan.
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            {currentPlan === "starter" && "Upgrade to unlock premium features"}
            {currentPlan === "professional" &&
              "Downgrade to starter"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availablePlans.map((plan) => {
              const isCurrentPlan = plan === currentPlan;
              const canChange =
                subscriptionStatus.canUpgradeTo.includes(plan) ||
                subscriptionStatus.canDowngradeTo.includes(plan);

              return (
                <Card
                  key={plan}
                  className={isCurrentPlan ? "border-primary" : ""}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      {getPlanDisplayName(plan)}
                      {isCurrentPlan && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-2xl font-bold">
                      {getPlanPrice(plan)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {plan === "starter" && (
                        <ul className="text-sm space-y-1">
                          <li>• Core platform features</li>
                          <li>• Basic analytics</li>
                          <li>• Community support</li>
                        </ul>
                      )}
                      {plan === "professional" && (
                        <ul className="text-sm space-y-1">
                          <li>• Everything in Starter</li>
                          <li>• Advanced analytics</li>
                          <li>• Priority support</li>
                          <li>• API access</li>
                        </ul>
                      )}

                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={!canChange || isLoading || isCurrentPlan || subscriptionDetails?.cancelAtPeriodEnd}
                        onClick={() => {
                          trackButtonClick(`plan_change_button`, { 
                            from: currentPlan, 
                            to: plan,
                            action: subscriptionStatus.canUpgradeTo.includes(plan) ? "upgrade" : "downgrade"
                          });
                          handlePlanChange(plan);
                        }}
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {subscriptionDetails?.cancelAtPeriodEnd
                          ? "Cancellation Pending"
                          : isCurrentPlan
                            ? "Current Plan"
                            : subscriptionStatus.canUpgradeTo.includes(plan)
                              ? "Upgrade"
                              : subscriptionStatus.canDowngradeTo.includes(plan)
                                ? "Downgrade"
                                : "Not Available"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {currentPlan !== "starter" && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Billing</CardTitle>
            <CardDescription>
              Access your customer portal to update payment methods, view
              invoices, and manage billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                trackButtonClick("customer_portal_button");
                setIsLoadingPortal(true);
                try {
                  const url = await getCustomerPortalUrl();
                  setCustomerPortalUrl(url);
                  trackEvent("customer_portal_opened");
                  window.open(url, "_blank", "noopener noreferrer");
                } catch (error) {
                  trackEvent("customer_portal_failed", { 
                    error: error instanceof Error ? error.message : 'unknown' 
                  });
                  console.error("Failed to get customer portal URL:", error);
                } finally {
                  setIsLoadingPortal(false);
                }
              }}
              disabled={isLoadingPortal}
            >
              {isLoadingPortal && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Customer Portal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
