import { useEffect, useState } from "react";
export { getStaticProps } from "../../../server-translation";

import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "@/features/app/auth/signup/constants";

import { AddCategory } from "@/features/admin/AddCategory";
import CategoryTree from "@/features/admin/CategoriesTreeView";
import {
	Box,
	Button,
	IconButton,
	Modal,
	Typography,
	useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AdminCategories = () => {
	const [categories, setCategories] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const categoriesCollection = collection(firestoreDB, "categories");

		const fetchCategories = async () => {
			const categoriesSnapshot = await getDocs(categoriesCollection);
			const categoriesData = categoriesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			setCategories(categoriesData);
		};

		fetchCategories();
	}, []);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<main className="w-full h-full pt-5 xl:px-6">
			<h1>Categories</h1>

			<CategoryTree data={categories} />
			<Button onClick={handleModalOpen}>Rajouter une category</Button>

			<Modal open={isModalOpen} onClose={handleModalClose}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: isMobile ? "100vw" : 800, // utilise 100% de la largeur de l'écran en mode mobile, 800px sinon
						height: isMobile ? "100vh" : "auto", // utilise 100% de
						bgcolor: "background.paper",
						borderRadius: 4,
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography variant="h4" component="h2" sx={{ mb: 4 }}>
						Rajouter une category
						<IconButton
							sx={{ position: "absolute", top: 20, right: 20 }}
							onClick={handleModalClose}
						>
							<CloseIcon />
						</IconButton>
					</Typography>
					<AddCategory />
				</Box>
			</Modal>
		</main>
	);
};

export default AdminCategories;
