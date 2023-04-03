import { yupResolver } from "@hookform/resolvers/yup";

import { getFirestore, setDoc, doc } from "firebase/firestore";

import * as yup from "yup";

import useRootStore from "@/store/useRoot";
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "react-phone-input-2/lib/style.css";
import "firebase/auth";

import PhoneInput from "react-phone-input-2";

import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { app } from "../_app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {
	TextField,
	Checkbox,
	Button,
	FormControlLabel,
	Switch,
} from "@mui/material";
import { ImageInput } from "@/components/Image";
import { UserData } from "@/store/user";

const firestoreDB = getFirestore(app);

const getFirebaseErrorMessage = (errorCode: string) => {
	switch (errorCode) {
		case "auth/email-already-in-use":
			return "The email address you entered is already associated with an account. Please use a different email address or login instead.";
		case "auth/invalid-email":
			return "The email address you entered is not valid. Please check your email address and try again.";
		case "auth/weak-password":
			return "The password you entered is weak. Please use a stronger password.";
		default:
			return "An error occurred while processing your request. Please try again later.";
	}
};

const Signup = () => {
	const { user, signup } = useRootStore.getState();
	const { t } = useTranslation();
	const schema = yup.object().shape({
		firstName: yup.string().required(t("first name") as string),
		lastName: yup.string().required(t("last name") as string),
		adress: yup.string().required(t("Adress") as string),
		phoneNumber: yup.string().required(t("Adress") as string),
		email: yup
			.string()
			.required(t("form.error.email") as string)
			.email(),
		password: yup
			.string()
			.required(t("Le mot de passe est requis") as string)
			.min(8, t("il faut min 8 car") as string),
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const {
		handleSubmit,
		formState: { errors },
		control,
		register,
		setError,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const watchCompanyChange = watch("companySwitch");
	const emailInputRef = useRef<HTMLInputElement>(null);

	const handleSubmitUserSignup: SubmitHandler<FieldValues> = async (data) => {
		const {
			email,
			password,
			phoneNumber,
			adress,
			photoURL,
			firstName,
			lastName,
			pseudo,
			company,
		} = data as UserData;

		setIsSubmitting(true);

		try {
			const auth = getAuth();
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await sendEmailVerification(user);

			let downloadURL = "";
			if (photoURL?.file) {
				const storage = getStorage();
				const fileRef = ref(storage, `images/${photoURL.file.name}`);
				await uploadBytes(fileRef, photoURL.file);
				downloadURL = await getDownloadURL(fileRef);
			}
			await updateProfile(user, {
				displayName: `${firstName} ${lastName}`,
				photoURL: downloadURL ?? "",
			});

			const userSignupData = {
				uid: user.uid,
				email: user.email as string,
				name: `${lastName} ${firstName}`,
				phoneNumber,
				adress: adress,
				photoURL: downloadURL,
				entreprise: company ?? "",
				pseudo: pseudo ?? "",
			};

			await setDoc(doc(firestoreDB, "users", user.uid), userSignupData);

			// Get access token and refresh token
			const idTokenResult = await user.getIdTokenResult();
			const accessToken = idTokenResult.token;
			const refreshToken = user.refreshToken;

			signup({
				user: {
					auth: {
						isAuth: true,
						accessToken: accessToken,
						refreshToken: refreshToken,
					},
					data: { ...userSignupData, firstName, lastName },
				},
			});

			router.push("/dashboard");
		} catch (error: any) {
			setIsSubmitting(false);
			const errorMessage = getFirebaseErrorMessage(error.code);
			setError("email", { type: "manual", message: errorMessage });
			emailInputRef.current?.focus();
		}
	};

	useEffect(() => {
		if (user.auth.isAuthenticated) router.push("/dashboard");
	}, [router]);

	return (
		<form
			onSubmit={handleSubmit(handleSubmitUserSignup)}
			className="w-full max-w-md gap-y-5 flex flex-col"
		>
			{/* @ts-ignore */}
			<span className="h-12">{errors?.password?.message}</span>
			<h1 className="text-4xl font-medium mb-6">Signup</h1>
			<Controller
				name="firstName"
				control={control}
				render={({ field: { value = "", onChange }, fieldState }) => {
					return (
						<>
							<TextField
								placeholder="Make the change"
								error={!!fieldState.error}
								type="text"
								label={t("First name")}
								helperText={fieldState.error?.message}
								required
								onChange={onChange}
								value={value}
							/>
						</>
					);
				}}
			/>
			<Controller
				name="lastName"
				control={control}
				render={({ field: { value = "", onChange }, fieldState }) => {
					return (
						<>
							<TextField
								placeholder="Make the change"
								error={!!fieldState.error}
								type="text"
								label={t("Last name")}
								helperText={fieldState.error?.message}
								required
								onChange={onChange}
								value={value}
							/>
						</>
					);
				}}
			/>
			<Controller
				name="pseudo"
				control={control}
				render={({ field: { value = "", onChange }, fieldState }) => {
					return (
						<>
							<TextField
								placeholder="Make the change"
								error={!!fieldState.error}
								type="text"
								label={t("Pseudo")}
								helperText={fieldState.error?.message}
								onChange={onChange}
								value={value}
							/>
						</>
					);
				}}
			/>
			<Controller
				name="email"
				control={control}
				rules={{ required: "Email is required" }}
				render={({ field, fieldState }) => (
					<TextField
						inputRef={emailInputRef}
						label="Email"
						placeholder="Enter your email"
						error={!!fieldState.error}
						type="email"
						required
						helperText={fieldState.error?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				name="adress"
				control={control}
				rules={{ required: "Email is required" }}
				render={({ field, fieldState }) => (
					<TextField
						label="Adress"
						placeholder="Enter your email"
						required
						error={!!fieldState.error}
						helperText={fieldState.error?.message}
						{...field}
					/>
				)}
			/>
			<Controller
				name="phoneNumber"
				defaultValue=""
				control={control}
				render={({ field: { value, onChange }, fieldState }) => {
					return (
						<div data-cy="phone" className="relative w-full" id="phone-parent">
							<p className="mb-2 w-full text-sm font-semibold text-fresh-gray-900 first-letter:uppercase md:text-base 2xl:text-lg">
								{t("form.phone")}
							</p>
							<div className="relative w-full">
								<PhoneInput
									onChange={onChange}
									value={value}
									country={"be"}
									inputClass={`!w-full !border !border-fresh-gray-200 group-hover:!border-[#9ABE36] focus:!border-[#9ABE36] focus:!bg-fresh-gray-50 2xl:!text-lg group-hover:!bg-fresh-gray-50 min-h-[42px] ${
										fieldState.error ? "!border-fresh-red-900" : ""
									}`}
								/>
							</div>
							{fieldState.error && (
								<p className="absolute right--3 -top-3 text-fresh-red-900 text-sm">
									{fieldState.error.message}
								</p>
							)}
						</div>
					);
				}}
			/>
			<ImageInput name="photoURL" control={control} />

			<Controller
				name="password"
				defaultValue=""
				control={control}
				rules={{
					required: "Password is required",
					minLength: {
						value: 8,
						message: "Password should have at least 8 characters",
					},
				}}
				render={({ field: { onChange, value }, fieldState }) => (
					<TextField
						label="Password"
						placeholder="Enter your password"
						required
						type="password"
						error={!!fieldState.error}
						value={value}
						helperText={fieldState.error?.message}
						onChange={onChange}
					/>
				)}
			/>
			<Controller
				name="confirmPassword"
				defaultValue=""
				control={control}
				rules={{
					required: "Password is required",
					minLength: {
						value: 8,
						message: "Password should have at least 8 characters",
					},
				}}
				render={({ field: { onChange, value }, fieldState }) => (
					<TextField
						label="Confirm password"
						placeholder="Confirm password"
						required
						error={!!fieldState.error}
						type="password"
						value={value}
						helperText={fieldState.error?.message}
						onChange={onChange}
					/>
				)}
			/>
			<Controller
				name="companySwitch"
				control={control}
				render={({ field: { onChange, value }, fieldState }) => (
					<FormControlLabel
						control={<Switch value={value} onChange={onChange} />}
						label="Company"
					/>
				)}
			/>
			{watchCompanyChange && (
				<Controller
					name="company"
					control={control}
					render={({ field: { value = "", onChange }, fieldState }) => {
						return (
							<>
								<TextField
									placeholder="Company"
									error={!!fieldState.error}
									type="text"
									label={t("company")}
									helperText={fieldState.error?.message}
									onChange={onChange}
									value={value}
								/>
							</>
						);
					}}
				/>
			)}

			<div className="flex items-center">
				<Checkbox
					{...register("termsOfUse")}
					name="termsOfUse"
					color="primary"
				/>
				<span className="ml-2">
					{t("By signing up, you agree to our")}{" "}
					<a
						href="/terms-and-conditions"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						{t("terms of use")}
					</a>{" "}
					{t("and")}{" "}
					<a
						href="/privacy-policy"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						{t("privacy policy")}
					</a>
				</span>
			</div>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
				className="mt-4"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Loading..." : "Signup"}
			</Button>
			<p className="text-center mt-4">
				{t("Already have an account?")}{" "}
				<Link href="/auth/login">{t("form.login.button")}</Link>
			</p>
		</form>
	);
};

export default Signup;
