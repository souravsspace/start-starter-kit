import { appConfig, marketingFooterLinks as links } from "@/app-config";
import { usePostHogTracking } from "@/hooks/use-posthog-tracking";
import { Link } from "@tanstack/react-router";
import { Icons } from "../Icons";
import { ThemeToggle } from "../theme/ThemeToggle";

export const Footer = () => {
	const { trackButtonClick } = usePostHogTracking();
	return (
		<footer className="border-b bg-white pt-20 dark:bg-transparent">
			<div className="mx-auto max-w-5xl px-6">
				<div className="grid gap-12 md:grid-cols-5">
					<div className="md:col-span-2">
						<Link
							to="/"
							aria-label="go home"
							className="block size-fit"
							onClick={() => trackButtonClick("footer_logo_click")}
						>
							<Icons.logo className="size-6 sm:size-7" />
						</Link>
					</div>

					<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:col-span-3">
						{links.map((link, index) => (
							<div key={index} className="space-y-4 text-sm">
								<span className="block font-medium">{link.group}</span>
								{link.items.map((item) => (
									<Link
										key={item.href}
										to={item.href}
										className="text-muted-foreground hover:text-primary block duration-150"
										onClick={() =>
											trackButtonClick("footer_link_click", {
												link: item.title,
												href: item.href,
												group: link.group,
											})
										}
									>
										<span>{item.title}</span>
									</Link>
								))}
							</div>
						))}
					</div>
				</div>
				<div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
					<span className="text-muted-foreground order-last block text-center text-sm md:order-first">
						© {new Date().getFullYear()} {appConfig.name}, All rights reserved
					</span>
					<div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
};
