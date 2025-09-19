import packageJson from "../package.json";

export const appConfig = {
  name: packageJson.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  version: packageJson.version,
};

export const marketingHeaderMenuItems = [
  { name: "Features", href: "#features" },
  { name: "Solution", href: "#solution" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export const marketingFooterLinks = [
  {
    group: "Product",
    items: [
      { title: "Features", href: "#features" },
      { title: "Solution", href: "#solution" },
      { title: "Pricing", href: "/pricing" },
      { title: "Help", href: "#" },
      { title: "About", href: "/about" },
    ],
  },
  {
    group: "Solution",
    items: [
      {
        title: "Startup",
        href: "#",
      },
      {
        title: "Freelancers",
        href: "#",
      },
      {
        title: "Organizations",
        href: "#",
      },
      {
        title: "Collaboration",
        href: "#",
      },
      {
        title: "Design",
        href: "#",
      },
      {
        title: "Management",
        href: "#",
      },
    ],
  },
  {
    group: "Company",
    items: [
      {
        title: "About",
        href: "#",
      },
      {
        title: "Careers",
        href: "#",
      },
      {
        title: "Blog",
        href: "#",
      },
      {
        title: "Press",
        href: "#",
      },
      {
        title: "Contact",
        href: "#",
      },
      {
        title: "Help",
        href: "#",
      },
    ],
  },
  {
    group: "Legal",
    items: [
      {
        title: "Licence",
        href: "#",
      },
      {
        title: "Privacy",
        href: "#",
      },
      {
        title: "Cookies",
        href: "#",
      },
      {
        title: "Security",
        href: "#",
      },
    ],
  },
];
