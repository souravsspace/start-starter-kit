import { useSession } from "@/integrations/better-auth/client";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme/ThemeToggle";

export default function Header() {
	const { data: session } = useSession();

	const isLoggedIn = !!session?.user;

	return (
		<header className="p-2 flex gap-2 justify-between">
			<nav className="flex flex-row">
				<div className="px-2 font-bold">
					<Link to="/">Home</Link>
				</div>

				{isLoggedIn && (
					<div className="px-2 font-bold">
						<Link to="/dashboard">Dashboard</Link>
					</div>
				)}

				<div className="px-2 font-bold">
					<Link to="/auth/register">Register</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/auth/login">Login</Link>
				</div>

				<ThemeToggle />
			</nav>
		</header>
	);
}
