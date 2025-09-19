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
import { appConfig } from "@/app-config";

// TODO: Add form handling and submission logic

export const Route = createFileRoute("/_marketing/help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          Help Center
        </h1>
        <p className="mt-4 text-center">
          Need assistance? Our help center is here to provide answers and
          support for all your questions.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Quick Support</h2>
              <p className="text-sm text-muted-foreground">
                Get help from our support team with specific issues or
                questions.
              </p>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">
                    General Inquiries
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {appConfig.supportEmail.general}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Technical Support
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {appConfig.supportEmail.support}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Self-Service Resources</h2>
              <p className="text-sm text-muted-foreground">
                Find answers quickly with our comprehensive documentation and
                guides.
              </p>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  API Reference
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Video Tutorials
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mx-auto mt-12 max-w-lg p-8 shadow-md sm:p-16">
          <div>
            <h2 className="text-xl font-semibold">Submit a Help Request</h2>
            <p className="mt-4 text-sm">
              Can't find what you're looking for? Submit a help request and our
              team will get back to you as soon as possible.
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
              <Label htmlFor="category">Help Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="getting-started">
                    Getting Started
                  </SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="technical">Technical Issues</SelectItem>
                  <SelectItem value="features">
                    Features & Functionality
                  </SelectItem>
                  <SelectItem value="api">API & Integration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                placeholder="Brief description of your question"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Please provide detailed information about your question or issue..."
                required
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General question</SelectItem>
                  <SelectItem value="medium">Medium - Need guidance</SelectItem>
                  <SelectItem value="high">High - Blocking issue</SelectItem>
                  <SelectItem value="urgent">
                    Urgent - Critical problem
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button>Submit Help Request</Button>
          </form>
        </Card>

        <div className="mt-12 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Response Times</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="font-medium">Low Priority</div>
                <div className="text-sm text-muted-foreground">24-48 hours</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Medium Priority</div>
                <div className="text-sm text-muted-foreground">12-24 hours</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">High/Urgent</div>
                <div className="text-sm text-muted-foreground">2-8 hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
