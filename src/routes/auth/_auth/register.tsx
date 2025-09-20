import { appConfig } from "@/app-config";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/integrations/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth/_auth/register")({
	component: RouteComponent,
});

const registerSchema = z.object({
	firstname: z.string().min(2, "First name must be at least 2 characters"),
	lastname: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type TRegisterSchema = z.infer<typeof registerSchema>;

function RouteComponent() {
	const navigate = Route.useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<TRegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
		},
	})

	const isLoading =
		form.formState.isSubmitting || form.formState.isLoading || isSubmitting;

	const onSubmit = async (data: TRegisterSchema) => {
		try {
			const result = await signUp.email(
				{
					name: `${data.firstname} ${data.lastname}`,
					email: data.email,
					password: data.password,
				},
				{
					onRequest: () => {
						setIsSubmitting(true);
					},
					onSuccess: async () => {
						setIsSubmitting(false);
						toast.success("Registered successfully!");
						await navigate({ to: "/dashboard" });
					},
					onError: (ctx) => {
						setIsSubmitting(false);
						console.error("ERROR: ", ctx.error);
						toast.error(
							ctx.error.message || "Something went wrong. Please try again.",
						)
					},
				},
			)

			if (result.error) {
				console.error("Signup error:", result.error);
				toast.error(result.error.message || "Registration failed");
			}
		} catch (err) {
			setIsSubmitting(false);
			console.error("Signup catch error:", err);
			toast.error("Network error. Please try again.");
		}
	}

	const onGoogleSignIn = async () => {
		const { error } = await signIn.social(
			{ provider: "google" },
			{
				onRequest: () => {
					setIsSubmitting(true);
				},
				onSuccess: async () => {
					setIsSubmitting(false);
					await navigate({ to: "/dashboard" });
				},
				onError: (ctx) => {
					setIsSubmitting(false);
					console.error("ERROR: ", ctx.error.message);
					toast.error("Something went wrong. Please try again.");
				},
			},
		)
		console.error({ error });
	}

	const onGithubSignIn = async () => {
		const { error } = await signIn.social(
			{ provider: "github" },
			{
				onRequest: () => {
					setIsSubmitting(true);
				},
				onSuccess: async () => {
					setIsSubmitting(false);
					await navigate({ to: "/dashboard" });
				},
				onError: (ctx) => {
					setIsSubmitting(false);
					console.error("ERROR: ", ctx.error.message);
					toast.error("Something went wrong. Please try again.");
				},
			},
		)
		console.error({ error });
	}

	return (
		<section className="flex bg-zinc-50 px-4 py-16  dark:bg-transparent">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
				>
					<div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
						<div className="text-center">
							<Link to="/" aria-label="go home" className="mx-auto block w-fit">
								<Icons.logo className="size-8" />
							</Link>
							<h1 className="mb-1 mt-4 text-xl font-semibold">
								Create a {appConfig.name} Account
							</h1>
							<p className="text-sm">
								Welcome! Create an account to get started
							</p>
						</div>

						<div className="mt-6 space-y-6">
							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="firstname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input
													placeholder="John"
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input
													placeholder="doe"
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="example@mail.com"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center justify-between">
											<span>Password</span>
											<Button asChild variant="link" size="sm">
												<Link
													to="/"
													className="link intent-info variant-ghost text-sm"
												>
													Forgot your Password ?
												</Link>
											</Button>
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isLoading}>
								Continue
							</Button>
						</div>

						<div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
							<hr className="border-dashed" />
							<span className="text-muted-foreground text-xs">
								Or continue With
							</span>
							<hr className="border-dashed" />
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={onGoogleSignIn}
							>
								<Icons.google className="size-5" />
								<span>Google</span>
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={onGithubSignIn}
							>
								<Icons.github className="size-5" />
								<span>GitHub</span>
							</Button>
						</div>
					</div>

					<div className="p-3">
						<p className="text-accent-foreground text-center text-sm">
							Have an account ?
							<Button
								asChild
								variant="link"
								className="px-2"
								disabled={isLoading}
							>
								<Link to="/auth/login">Sign In</Link>
							</Button>
						</p>
					</div>
				</form>
			</Form>
		</section>
	)
}
