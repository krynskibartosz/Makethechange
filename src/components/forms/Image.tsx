import { useState, useEffect, useRef, ChangeEvent } from "react";
import { CardMedia } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
	Control,
	FieldPath,
	FieldValues,
	useController,
} from "react-hook-form";
import {
	CameraIcon,
	PhotoIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

const useStyles = makeStyles({
	root: {
		margin: "0 auto",
		width: "100%",
	},
	media: {},
});

type ImageInputProps = {
	name: FieldPath<FieldValues>;
	control: Control<FieldValues>;
	defaultValue?: {
		name: string;
		file: File;
		dataURL: string;
	};
};

export function ImageInput({ name, control, defaultValue }: ImageInputProps) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const classes = useStyles();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { field, fieldState } = useController({
		name,
		control,
		defaultValue,
	});

	const { error } = fieldState;

	const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader?.readAsDataURL(file);
		reader.onloadend = () => {
			setSelectedFile(file);
			field.onChange({
				name: file.name,
				file,
				dataURL: reader.result,
			});
		};
	};

	const removeSelectedFile = () => {
		setSelectedFile(null);
		field.onChange(null);
	};

	useEffect(() => {
		if (defaultValue) {
			setSelectedFile(defaultValue.file);
		}
	}, [defaultValue]);

	const handleClickMedia = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={classes.root}>
			<input
				type="file"
				accept="image/*"
				onChange={handleSelectFile}
				style={{ display: "none" }}
				id={`${name}-input`}
				ref={fileInputRef}
			/>
			<div className="group">
				{!selectedFile && (
					<div
						onClick={handleClickMedia}
						className={`${classes.media} cursor-pointer relative border-2 border-dashed transition-all duration-300 ease-in-out group-hover:border-green-500 border-gray-200 rounded-sm h-32 w-full`}
						title="Select Image"
					>
						<div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2  justify-center flex flex-col items-center   group top-1/2 left-1/2 ">
							<PhotoIcon className="w-10 transition-all duration-300 ease-in-out  h-10  text-gray-200  group-hover:text-green-500" />
							<p
								className={`text-gray-200 transition-all duration-300 ease-in-out max-md:hidden   group-hover:text-green-500 text-center`}
							>
								Upload Image
							</p>
						</div>
					</div>
				)}
				{selectedFile && (
					<CardMedia
						className={`${classes.media} w-full h-32 relative rounded-md`}
						image={field.value.dataURL}
						title="Selected Image"
					>
						<div className="absolute w-full h-full gap-x-5 flex justify-center z-50 items-center">
							<CameraIcon
								className="w-10 group-hover:scale-110 transition-all duration-300 ease-in-out h-10  text-gray-200 cursor-pointer hover:text-green-500"
								onClick={handleClickMedia}
							/>
							<XCircleIcon
								onClick={removeSelectedFile}
								className="w-10 group-hover:scale-110 transition-all duration-300 ease-in-out  rounded-full h-10 text-gray-200 cursor-pointer hover:text-red-500"
							/>
						</div>
					</CardMedia>
				)}
			</div>
			{error && <span style={{ color: "red" }}>{error.message}</span>}
		</div>
	);
}
