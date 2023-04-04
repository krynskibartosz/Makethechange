import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { TextField, TextFieldProps } from "@material-ui/core";

type FormTextFieldProps = {
	name: FieldPath<FieldValues>;
	control: Control<FieldValues>;
};

export const FormTextField = ({
	name,
	control,
	...rest
}: FormTextFieldProps & TextFieldProps) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<TextField
					error={!!fieldState.error}
					helperText={fieldState.error?.message}
					variant="outlined"
					{...field}
					{...rest}
				/>
			)}
		/>
	);
};
