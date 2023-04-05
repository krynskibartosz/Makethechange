import {
	AppBar,
	Toolbar,
	Box,
	Tooltip,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useHasHydrated } from "@/hooks";
import useRootStore from "@/store/useRoot";

export const AdminNavbar = () => {
	const hasHydrated = useHasHydrated();
	const { user } = useRootStore.getState();
	const userImg = user.data?.photoURL;
	const [anchorElUser, setAnchorElUser] = useState(null);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return (
		<AppBar
			color="inherit"
			position="sticky"
			elevation={0}
			className="shadow-main border-b border-gray-200"
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Link className="font-bold italic text-xl text-gray-700" href="/">
						Makethechange
					</Link>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", rowGap: 20 }}>
					{hasHydrated && (
						<>
							<Tooltip title="Settings">
								<IconButton onClick={handleOpenUserMenu}>
									<Avatar
										alt="user-avatar"
										src={userImg || "/default-avatar.png"}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{["Settings"].map((setting) => (
									<MenuItem key={setting} onClick={handleCloseUserMenu}>
										<Typography textAlign="center">{setting}</Typography>
									</MenuItem>
								))}
							</Menu>
						</>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
