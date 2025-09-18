import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
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
