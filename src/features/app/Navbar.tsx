import { useHasHydrated } from "@/hooks";
import useRootStore from "@/store/useRoot";
import { AppBar, Toolbar, Box, Avatar, Button } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const AppNavbar = () => {
	const { user } = useRootStore.getState();
	const userImg = user.data?.photoURL;
	const isAuth = user.auth.isAuthenticated;
	const { t: translation } = useTranslation();
	const hasHydrated = useHasHydrated();
	return (
		<AppBar
			className="shadow-main  border-b border-gray-200 "
			color="default"
			position="sticky"
			elevation={0}
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Link className="font-bold italic text-xl text-gray-700" href="/">
						Makethechange
					</Link>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", rowGap: 20 }}>
					{isAuth && hasHydrated ? (
						<Link href="/dashboard">
							<Avatar
								alt="user-avatar"
								src={userImg || "/default-avatar.png"}
							/>
						</Link>
					) : (
						<>
							<Link href="/auth/login">
								<Button color="inherit">{translation("Se connecter")}</Button>
							</Link>
							<Link href="/auth/signup">
								<Button color="inherit">{translation("S'inscrire")}</Button>
							</Link>
						</>
					)}
					<Link href="/admin">
						<Button color="inherit">{translation("Admin")}</Button>
					</Link>
				</Box>
			</Toolbar>
		</AppBar>
	);
};
