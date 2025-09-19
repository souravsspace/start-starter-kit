import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_marketing/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  const privacySections = [
    {
      id: "information-collection",
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support."
    },
    {
      id: "information-usage",
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you."
    },
    {
      id: "information-sharing",
      title: "3. Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy."
    },
    {
      id: "data-security",
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      id: "user-rights",
      title: "5. Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also object to or restrict processing of your data."
    },
    {
      id: "cookies",
      title: "6. Cookies",
      content: "We use cookies and similar tracking technologies to enhance your experience on our website. You can set your browser to refuse all cookies or to indicate when a cookie is being sent."
    },
    {
      id: "third-party",
      title: "7. Third-Party Services",
      content: "Our service may contain links to third-party websites. We are not responsible for the privacy practices of these third-party sites."
    },
    {
      id: "children-privacy",
      title: "8. Children's Privacy",
      content: "Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13."
    },
    {
      id: "policy-changes",
      title: "9. Changes to This Policy",
      content: "We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page."
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content: "If you have any questions about this privacy policy, please contact us."
    }
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {privacySections.map((section) => (
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
