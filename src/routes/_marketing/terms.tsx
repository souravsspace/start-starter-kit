import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

export const Route = createFileRoute("/_marketing/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  const { trackPageView } = usePostHogTracking();
  
  trackPageView("terms_page");
  const termsSections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      id: "license",
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only."
    },
    {
      id: "disclaimer",
      title: "3. Disclaimer",
      content: "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      id: "limitations",
      title: "4. Limitations",
      content: "In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website."
    },
    {
      id: "accuracy",
      title: "5. Accuracy of Materials",
      content: "The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current."
    },
    {
      id: "links",
      title: "6. Links",
      content: "We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site."
    },
    {
      id: "modifications",
      title: "7. Modifications",
      content: "We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service."
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate."
    }
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms of service carefully before using our service.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {termsSections.map((section) => (
              <div key={section.id} className="group">
                <AccordionItem
                  value={section.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-left hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{section.content}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
