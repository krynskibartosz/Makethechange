import { useEffect, useState } from "react";
export { getStaticProps } from "../../../server-translation";

import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "@/features/auth/signup/constants";

import { AddCategory } from "@/features/admin/AddCategory";
import CategoryTree from "@/features/admin/TreeView";

const Admin = () => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		// Initialise la connexion à Firestore

		// Récupère la collection "categories"
		const categoriesCollection = collection(firestoreDB, "categories");

		// Effectue la requête pour récupérer les documents de la collection "categories"
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

		// Appelle la fonction pour récupérer les données de la collection "categories"
		fetchCategories();
	}, []);

	return (
		<main className="w-full xl:px-20 px-5">
			<h1>Categories</h1>

			<CategoryTree data={categories} />
			<AddCategory />
		</main>
	);
};

export default Admin;
