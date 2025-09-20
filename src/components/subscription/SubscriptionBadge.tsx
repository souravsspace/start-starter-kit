import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/use-subscription";

export function SubscriptionBadge() {
	const { subscriptionStatus, getPlanDisplayName } = useSubscription();

	if (!subscriptionStatus?.isAuthenticated || !subscriptionStatus.currentPlan) {
		return null;
	}

	const getVariant = () => {
		switch (subscriptionStatus.currentPlan) {
			case "starter":
				return "secondary";
			case "professional":
				return "default";
			default:
				return "secondary";
		}
	};

	return (
		<Badge variant={getVariant()}>
			{getPlanDisplayName(subscriptionStatus.currentPlan)}
		</Badge>
	);
}
