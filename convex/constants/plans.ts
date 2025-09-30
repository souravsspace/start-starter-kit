export const PLANS = {
  PREMIUM_MONTHLY: {
    id: process.env.VITE_PREMIUM_MONTHLY_PRICE_ID as string,
    price: process.env.VITE_PREMIUM_MONTHLY_PRICE as string,
    frontendId: "premiumMonthly",
  },
  PREMIUM_YEARLY: {
    id: process.env.VITE_PREMIUM_YEARLY_PRICE_ID as string,
    price: process.env.VITE_PREMIUM_YEARLY_PRICE as string,
    frontendId: "premiumYearly",
  },
} as const;
