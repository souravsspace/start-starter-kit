import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Cpu, Zap, Mail, SendHorizonal } from "lucide-react";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

// TODO: Add more detailed content about the platform, team, mission, and values.

export const Route = createFileRoute("/_marketing/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("about_page");
  return (
    <>
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-semibold lg:text-5xl">
              About Our Platform
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Building the future of digital experiences with cutting-edge
              technology and human-centered design.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
            Our ecosystem brings together powerful solutions.
          </h2>
          <div className="relative">
            <div className="relative z-10 space-y-4 md:w-1/2">
              <p>
                We're evolving to be more than just a platform.{" "}
                <span className="font-medium">
                  We support an entire ecosystem
                </span>{" "}
                — from products to APIs and platforms helping developers and
                businesses innovate.
              </p>
              <p>
                Our ecosystem supports an entire range of solutions — from
                products to the APIs and platforms helping developers and
                businesses innovate.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4" />
                    <h3 className="text-sm font-medium">Fast</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Lightning-fast performance helping developers and businesses
                    innovate quickly.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="size-4" />
                    <h3 className="text-sm font-medium">Powerful</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Robust infrastructure supporting enterprises and businesses
                    of all sizes.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:mask-l-from-35% md:mask-l-to-55% mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
              <div className="border-border/50 relative rounded-2xl border border-dotted p-2 bg-muted/30">
                <div className="rounded-[12px] h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Cpu className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Platform Visualization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl">
            <blockquote>
              <p className="text-lg font-semibold sm:text-xl md:text-3xl">
                Using this platform has been like unlocking a secret design
                superpower. It's the perfect fusion of simplicity and
                versatility, enabling us to create UIs that are as stunning as
                they are user-friendly.
              </p>

              <div className="mt-12 flex items-center gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                </div>
                <div className="space-y-1 border-l pl-6">
                  <cite className="font-medium">Sarah Johnson</cite>
                  <span className="text-muted-foreground block text-sm">
                    CTO, TechCorp
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              Start Building
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of developers building amazing products with our
              platform.
            </p>

            <form className="mx-auto mt-10 max-w-sm lg:mt-12">
              <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                <Mail className="text-muted-foreground pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                <input
                  placeholder="Your email address"
                  className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                  type="email"
                />

                <div className="md:pr-1.5 lg:pr-0">
                  <Button aria-label="submit" className="rounded-(--radius)">
                    <span className="hidden md:block">Get Started</span>
                    <SendHorizonal
                      className="relative mx-auto size-5 md:hidden"
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
