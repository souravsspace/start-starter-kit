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
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/_marketing/help")({
  component: RouteComponent,
});

const helpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  category: z.enum([
    "getting-started",
    "account",
    "billing",
    "technical",
    "features",
    "api",
    "other",
  ]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type THelpSchema = z.infer<typeof helpSchema>;

function RouteComponent() {
  const { trackButtonClick, trackFormSubmit, trackPageView } =
    usePostHogTracking();
  
  trackPageView({ page: "help_page" });
  const submitSupportRequest = useMutation(api.support.submitSupportRequest);

  const form = useForm<THelpSchema>({
    resolver: zodResolver(helpSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "other",
      subject: "",
      message: "",
      priority: "medium",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: THelpSchema) => {
    trackFormSubmit("help_request_form", {
      category: data.category,
      priority: data.priority,
    });

    try {
      await submitSupportRequest({
        ...data,
        type: "help",
      });

      toast.success(
        "Help request submitted successfully! We'll get back to you soon.",
      );
      form.reset();
    } catch (error) {
      console.error("Failed to submit help request:", error);
      toast.error("Failed to submit help request. Please try again.");
    }
  };

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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => trackButtonClick("help_documentation_button")}
                >
                  Documentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => trackButtonClick("help_api_reference_button")}
                >
                  API Reference
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    trackButtonClick("help_community_forum_button")
                  }
                >
                  Community Forum
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    trackButtonClick("help_video_tutorials_button")
                  }
                >
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-12 space-y-6 *:space-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="getting-started">
                          Getting Started
                        </SelectItem>
                        <SelectItem value="account">
                          Account Management
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing & Payments
                        </SelectItem>
                        <SelectItem value="technical">
                          Technical Issues
                        </SelectItem>
                        <SelectItem value="features">
                          Features & Functionality
                        </SelectItem>
                        <SelectItem value="api">API & Integration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of your question"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Please provide detailed information about your question or issue..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          Low - General question
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium - Need guidance
                        </SelectItem>
                        <SelectItem value="high">
                          High - Blocking issue
                        </SelectItem>
                        <SelectItem value="urgent">
                          Urgent - Critical problem
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Help Request"}
              </Button>
            </form>
          </Form>
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
