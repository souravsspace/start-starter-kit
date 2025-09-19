export const FAQs = () => {
  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32" id="faqs">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently <br className="hidden lg:block" /> Asked{" "}
              <br className="hidden lg:block" />
              Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            <div className="pb-6">
              <h3 className="font-medium">What is your refund policy?</h3>
              <p className="text-muted-foreground mt-4">
                We offer a 30-day money-back guarantee. If you're not satisfied
                with our product, you can request a full refund within 30 days
                of purchase.
              </p>

              <ol className="list-outside list-decimal space-y-2 pl-4">
                <li className="text-muted-foreground mt-4">
                  Contact our support team with your order number and refund
                  reason
                </li>
                <li className="text-muted-foreground mt-4">
                  Refunds are processed within 3-5 business days
                </li>
                <li className="text-muted-foreground mt-4">
                  Available for new customers, limited to one refund per
                  customer
                </li>
              </ol>
            </div>

            <div className="py-6">
              <h3 className="font-medium">How do I cancel my subscription?</h3>
              <p className="text-muted-foreground mt-4">
                You can cancel anytime from your account dashboard. Simply go to
                Settings → Billing → Cancel Subscription. Your access continues
                until the end of your current billing period.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-muted-foreground my-4">
                Yes! You can change your plan anytime from your account
                settings.
              </p>
              <ul className="list-outside list-disc space-y-2 pl-4">
                <li className="text-muted-foreground">
                  Upgrades take effect immediately with prorated billing
                </li>
                <li className="text-muted-foreground">
                  Downgrades take effect at the next billing cycle
                </li>
              </ul>
            </div>

            <div className="py-6">
              <h3 className="font-medium">
                What support options do you offer?
              </h3>
              <p className="text-muted-foreground mt-4">
                We offer 24/7 email support, live chat during business hours,
                and comprehensive documentation. Premium plans include priority
                support with faster response times.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">Is my data secure?</h3>
              <p className="text-muted-foreground mt-4">
                Absolutely! We use enterprise-grade encryption, regular security
                audits, and comply with SOC 2, GDPR, and CCPA standards. Your
                data is backed up daily and stored in secure, redundant
                facilities.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">
                Do you offer team or enterprise plans?
              </h3>
              <p className="text-muted-foreground mt-4">
                Yes! We have special pricing for teams and enterprise customers
                including advanced features, custom integrations, dedicated
                account management, and SLA guarantees. Contact our sales team
                for a custom quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
