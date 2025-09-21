import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";

// TODO: Add form handling and submission logic

export const Route = createFileRoute("/_marketing/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const { trackFormSubmit, trackButtonClick, trackPageView } = usePostHogTracking();
  
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          Contact Support
        </h1>
        <p className="mt-4 text-center">
          We're here to help! Get in touch with our support team for any
          questions or assistance.
        </p>

        <Card className="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
          <div>
            <h2 className="text-xl font-semibold">How can we help you?</h2>
            <p className="mt-4 text-sm">
              Our support team is ready to assist you with any issues or
              questions about our application.
            </p>
          </div>

          <form className="mt-12 space-y-6 *:space-y-3">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input type="text" id="name" required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" required />
            </div>

            <div>
              <Label htmlFor="topic">Topic</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Please provide detailed information about your issue or question..."
              />
            </div>

            <Button onClick={() => trackFormSubmit("contact_form")}>Send Message</Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
