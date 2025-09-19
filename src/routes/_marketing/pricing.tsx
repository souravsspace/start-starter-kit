import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_marketing/pricing")({
  component: RouteComponent,
});

// TODO: connect polar to it for checkout if logged in

function RouteComponent() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when you need more power. No hidden fees, no
            surprises.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Starter</h2>
                <span className="my-3 block text-2xl font-semibold">
                  $0 / mo
                </span>
                <p className="text-muted-foreground text-sm">
                  Perfect for trying out our platform
                </p>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/register">Get Started</Link>
              </Button>

              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Core platform features",
                  "Basic analytics & insights",
                  "Community support",
                  "1 project workspace",
                  "Standard templates",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">Professional</h2>
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                  <span className="my-3 block text-2xl font-semibold">
                    $5 / mo
                  </span>
                  <p className="text-muted-foreground text-sm">
                    For professionals and growing teams
                  </p>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/auth/register">Start Free Trial</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth/register">Get Lifetime Access - $49</Link>
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">
                  Everything in Starter, plus:
                </div>

                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {[
                    "Unlimited projects & workspaces",
                    "Advanced analytics & reporting",
                    "Priority email & chat support",
                    "Custom integrations & API access",
                    "100GB cloud storage",
                    "Premium templates & assets",
                    "Mobile apps for iOS & Android",
                    "Team collaboration features",
                    "Advanced security & compliance",
                    "Custom branding options",
                    "Early access to new features",
                    "Priority bug fixes & support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Still have questions?</h3>
            <p className="text-muted-foreground">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
