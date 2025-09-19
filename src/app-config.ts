import packageJson from "../package.json";

export const appConfig = {
  name: packageJson.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  version: packageJson.version,
  supportEmail: {
    general: `hello@${packageJson.domain}`,
    support: `support@${packageJson.domain}`,
  },
};

export const marketingHeaderMenuItems = [
  { name: "Faqs", href: "#faqs" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export const marketingFooterLinks = [
  {
    group: "Product",
    items: [
      { title: "FAQs", href: "#faqs" },
      { title: "Pricing", href: "/pricing" },
      { title: "Help", href: "/contact" },
      { title: "About", href: "/about" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Docs", href: "/docs" },
      { title: "Contact", href: "/contact" },
      { title: "Help", href: "/help" },
    ],
  },
  {
    group: "Legal",
    items: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
];
