import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/router";

export const drawerWidth = 240;
const navBarHeight = 65;
export const Sidebar = () => {
	const router = useRouter();

	const menuItems = [
		{
			text: "Accueil",
			path: "/admin",
		},
		{
			text: "Categories",
			path: "/admin/categories",
		},
		{
			text: "Produits",
			path: "/admin/products",
		},
		{
			text: "Commandes",
			path: "/admin/orders",
		},
	];

	return (
		<div>
			<Drawer
				sx={{
					"& .MuiDrawer-paper": {
						minWidth: drawerWidth,
						top: navBarHeight,
					},
				}}
				elevation={0}
				variant="permanent"
				anchor="left"
			>
				<List>
					{menuItems.map((item) => (
						<ListItemButton
							key={item.text}
							selected={router.pathname === item.path}
							onClick={() => router.push(item.path)}
						>
							<ListItemText primary={item.text} />
						</ListItemButton>
					))}
				</List>
			</Drawer>
		</div>
	);
};
