import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";
import { polar } from "./polar";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

polar.registerRoutes(http, {
  // Optional callbacks for webhook events
  onSubscriptionUpdated: async (ctx, event) => {
    // Handle subscription updates, like cancellations.
    // Note that a cancelled subscription will not be deleted from the database,
    // so this information remains available without a hook, eg., via
    // `getCurrentSubscription()`.
    console.log(
      "Subscription updated:",
      event.data.id,
      "Status:",
      event.data.status,
    );
    if (event.data.customerCancellationReason) {
      console.log("Customer cancelled:", event.data.customerCancellationReason);
    }
  },
  onSubscriptionCreated: async (ctx, event) => {
    // Handle new subscriptions
    console.log(
      "New subscription created:",
      event.data.id,
      "Product:",
      event.data.product?.name,
    );
  },
  onProductCreated: async (ctx, event) => {
    // Handle new products
    console.log("New product created:", event.data.id);
  },
  onProductUpdated: async (ctx, event) => {
    // Handle product updates
    console.log("Product updated:", event.data.id);
  },
});

export default http;