import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import resend from "@convex-dev/resend/convex.config";
import polar from "@convex-dev/polar/convex.config";

const app = defineApp();

app.use(betterAuth);
app.use(resend);
app.use(polar);

export default app;
