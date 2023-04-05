import { useState } from "react";

import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FormTextField } from "@/components/forms/TextField";
import {
	Typography,
	Button,
	TextField,
	Card,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectChangeEvent } from "@mui/material";

export const AddCategory = () => {
	const { t: translation } = useTranslation();
	const [subCategoryName, setSubCategoryName] = useState("");
	const [subCategories, setSubCategories] = useState<string[]>([]);
	const [tagName, setTagName] = useState("");
	const [tags, setTags] = useState<{ name: string; subCategory: string }[]>([]);

	const { handleSubmit, control, setValue, reset } = useForm({});

	type DataToTransform = {
		subCategories: string[];
		tags: { name: string; subCategory: string }[];
	};

	type TransformedData = {
		name: string;
		tags: string[];
	}[];

	const transformData = (data: DataToTransform) => {
		const categories: TransformedData = [];

		data.subCategories.forEach((subCat) => {
			const category = categories.find((cat) => cat.name === subCat) ?? {
				name: subCat,
				tags: [],
			};
			category.tags.push(
				...(data.tags
					?.filter((tag) => tag.subCategory === subCat)
					?.map((tag) => tag.name) ?? [])
			);
			if (!categories.includes(category)) categories.push(category);
		});

		return categories;
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		const subCategoriesGroupedWithCorrectTags = transformData({
			subCategories: data.subCategories,
			tags: data.tags,
		});

		try {
			const db = getFirestore();
			const categoriesCollection = collection(db, "categories");
			await addDoc(categoriesCollection, {
				name: data.name,
				subcategories: subCategoriesGroupedWithCorrectTags,
			});
			reset();
			setSubCategories([]);
			setSubCategoryName("");
			setTags([]);
		} catch (error) {
			console.error("Erreur lors de l'ajout de la catégorie : ", error);
		}
	};

	const handleDeleteSubCategory = (index: number) => {
		const newSubCategories = [...subCategories];
		newSubCategories.splice(index, 1);
		setSubCategories(newSubCategories);
		setValue("subCategories", newSubCategories);
	};

	const addSubCategory = () => {
		const newSubCategories = [...subCategories, subCategoryName];
		setSubCategories(newSubCategories);
		setValue("subCategories", newSubCategories);
		setSubCategoryName("");
	};

	const handleDeleteTag = (index: number) => {
		const newTags = [...tags];
		newTags.splice(index, 1);
		setTags(newTags);
		setValue("tags", newTags);
	};
	const addTag = () => {
		const newTags = [
			...tags,
			{ name: tagName, subCategory: selectedSubCategory },
		];
		setTags(newTags);
		setValue("tags", newTags);
		setTagName("");
		setSelectedSubCategory("");
	};

	const [selectedSubCategory, setSelectedSubCategory] = useState("");

	const handleSubCategoryChange = (event: SelectChangeEvent) => {
		setSelectedSubCategory(event.target.value as string);
	};

	return (
		<Card
			className="mt-10 xl:p-8 xl:pb-12 p-5 pb-8 shadow-main"
			variant="outlined"
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full  gap-y-5 flex flex-col "
			>
				<Typography variant="h4" component="h1" className="mb-6">
					Rajouter une category
				</Typography>
				<FormTextField
					name="name"
					label={translation("Nom de la category")}
					placeholder={translation("Soins personnels") as string}
					control={control}
					required
				/>
				<div className="flex gap-x-5 flex-wrap gap-y-2">
					<TextField
						label={translation("Nom de la sous category")}
						placeholder={
							translation("Soins du visSelectedSubCategory") as string
						}
						name="subCategory"
						value={subCategoryName}
						variant="outlined"
						fullWidth
						onChange={(e) => setSubCategoryName(e.target.value)}
					/>
					<Button variant="contained" color="primary" onClick={addSubCategory}>
						Rajouter une sous category
					</Button>
				</div>
				<ul className="flex gap-x-2 ">
					{subCategories.map((subCategory, i) => (
						<li key={i}>
							<Chip
								onDelete={() => handleDeleteSubCategory(i)}
								label={subCategory}
							/>
						</li>
					))}
				</ul>
				{subCategories.length > 0 && (
					<div className="flex gap-x-5 flex-wrap gap-y-2">
						<TextField
							label={translation("Nom du tag")}
							placeholder={translation("Litchi") as string}
							name="tag"
							value={tagName}
							variant="outlined"
							fullWidth
							onChange={(e) => setTagName(e.target.value)}
						/>
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">
								Sous category lier au tag
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Sous category lier au tag"
								value={selectedSubCategory}
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								onChange={handleSubCategoryChange}
							>
								{subCategories.map((el, i) => (
									<MenuItem key={i} value={el}>
										{el}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Button variant="contained" color="primary" onClick={addTag}>
							Rajouter un tag
						</Button>
					</div>
				)}

				<ul className="flex gap-x-2">
					{tags.map((tag, i) => (
						<li key={i}>
							<Chip
								onDelete={() => handleDeleteTag(i)}
								label={`${tag.name} - ${tag.subCategory}`}
							/>
						</li>
					))}
				</ul>

				<Button
					disabled={subCategories.length === 0}
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
				>
					Rajouter une category
				</Button>
			</form>
		</Card>
	);
};
