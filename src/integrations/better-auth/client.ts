import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [convexClient()],
});

export const {
	signIn,
	signUp,
	signOut,
	useSession,
	changePassword,
	forgetPassword,
	resetPassword,
	sendVerificationEmail,
} = authClient;
