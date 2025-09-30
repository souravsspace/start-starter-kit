import { Badge } from "@/components/ui/badge";
import { useUserTier } from "@/hooks/use-user-tier";

export function SubscriptionBadge() {
	const { getTierDisplayName } = useUserTier();

	return <Badge>{getTierDisplayName()}</Badge>;
}
