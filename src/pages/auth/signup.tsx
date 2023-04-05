import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import useRootStore from "@/store/useRoot";
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	User,
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
import { Checkbox, Button, FormControlLabel, Switch } from "@mui/material";
import { ImageInput } from "@/components/forms/Image";
import {
	uploadImageToFirebaseStorage,
	updateUserProfileInFirebase,
	saveUserSignupDataToFirestore,
	getFirebaseErrorMessage,
} from "@/features/app/auth/signup/signup";
import { UserData } from "@/interfaces/user";
import { Image } from "@/interfaces/common";
import { minPasswordLength } from "@/features/app/auth/signup/constants";
import { FormTextField } from "@/components/forms/TextField";

import { firestoreDB } from "@/features/app/auth/signup/constants";
import {
	signInWithPopup,
	GoogleAuthProvider,
	updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// todo: bug on phone input, maybe find a lib for
const Signup = () => {
	const { user, signup, signupWithGoogle } = useRootStore.getState();
	const { t: translation } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const emailInputRef = useRef<HTMLInputElement>(null);

	const schema = yup.object().shape({
		firstName: yup.string().required(translation("first name") as string),
		lastName: yup.string().required(translation("last name") as string),
		adress: yup.string().required(translation("Adress") as string),
		phoneNumber: yup.string().required(translation("Adress") as string),
		email: yup
			.string()
			.required(translation("form.error.email") as string)
			.email(),
		password: yup
			.string()
			.required(translation("Le mot de passe est requis") as string)
			.min(minPasswordLength, translation("il faut min 8 car") as string),
	});
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
	const watchIfIsACompany = watch("companySwitch");

	const storeUserDataInCache = async (
		user: User,
		userSignupData: UserData,
		firstName: string,
		lastName: string
	) => {
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
	};

	const handleUserSignupFormSubmit: SubmitHandler<FieldValues> = async (
		data
	) => {
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
		} = data as UserData & { password: string };

		setIsSubmitting(true);

		try {
			const auth = getAuth();
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await sendEmailVerification(user);

			const downloadURL = await uploadImageToFirebaseStorage(photoURL as Image);

			await updateUserProfileInFirebase(user, firstName, lastName, downloadURL);

			const userSignupData = {
				uid: user.uid,
				email: user.email as string,
				name: `${lastName} ${firstName}`,
				phoneNumber,
				adress: adress,
				photoURL: downloadURL,
				entreprise: company ?? "",
				pseudo: pseudo ?? "",
				password,
			};

			await saveUserSignupDataToFirestore(user, {
				...userSignupData,
				firstName,
				lastName,
			});

			await storeUserDataInCache(
				user,
				{ ...userSignupData, firstName, lastName },
				firstName,
				lastName
			);

			router.push("/dashboard");
		} catch (error: any) {
			setIsSubmitting(false);
			const errorMessage = getFirebaseErrorMessage(error.code);
			setError("email", { type: "manual", message: errorMessage });
			emailInputRef.current?.focus();
		}
	};

	const handleSignupWithGoogle = async () => {
		const auth = getAuth();

		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const { displayName, email, phoneNumber, photoURL, uid } = result.user;

			const gUser = {
				displayName,
				email,
				phoneNumber,
				photoURL,
				uid,
			};
			await sendEmailVerification(result.user);
			await updateProfile(result.user, {
				displayName,
				photoURL,
			});
			await setDoc(doc(firestoreDB, "users", uid), gUser);

			const idTokenResult = await result.user.getIdTokenResult();
			const accessToken = idTokenResult.token;
			const refreshToken = result.user.refreshToken;
			const nameArray = displayName?.split(" ");
			const firstName = nameArray?.[0] as string;
			const lastName = nameArray?.[nameArray.length - 1] as string;
			signupWithGoogle({
				user: {
					auth: {
						isAuth: true,
						accessToken: accessToken,
						refreshToken: refreshToken,
					},
					data: {
						email: email as string,
						firstName,
						lastName,
						photoURL: photoURL ?? "",
					},
				},
			});
			router.push("/dashboard");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (user.auth.isAuthenticated) router.push("/dashboard");
	}, [router, user.auth.isAuthenticated]);

	return (
		<main className="pt-5">
			<Button variant="outlined" onClick={handleSignupWithGoogle}>
				{"S'inscrire avec Google"}
			</Button>
			<form
				onSubmit={handleSubmit(handleUserSignupFormSubmit)}
				className="w-full max-w-md gap-y-5 flex flex-col"
			>
				{(errors?.email?.message as string)?.length > 0 && (
					<span className="h-12">{errors?.email?.message as string}</span>
				)}

				<h1 className="text-4xl font-medium mb-6">Signup</h1>
				<FormTextField
					name="firstName"
					label={translation("First name")}
					placeholder="Make the change"
					control={control}
					required
				/>

				<FormTextField
					name="lastName"
					label={translation("Last name")}
					placeholder="Make the change"
					control={control}
					required
				/>

				<FormTextField
					name="pseudo"
					label={translation("pseudo")}
					placeholder="Make the change"
					control={control}
				/>

				<FormTextField
					name="email"
					label={translation("Email")}
					placeholder="Make the change"
					control={control}
					type="email"
					required
				/>
				<FormTextField
					name="adress"
					label={translation("Adress")}
					placeholder="Make the change"
					control={control}
					required
				/>
				<Controller
					name="phoneNumber"
					defaultValue=""
					control={control}
					render={({ field, fieldState }) => {
						return (
							<div
								data-cy="phone"
								className="relative w-full"
								id="phone-parent"
							>
								<p className="mb-2 w-full text-sm font-semibold text-fresh-gray-900 first-letter:uppercase md:text-base 2xl:text-lg">
									{translation("form.phone")}
								</p>
								<div className="relative w-full">
									<PhoneInput
										country={"be"}
										inputClass={`!w-full !border !border-fresh-gray-200 group-hover:!border-[#9ABE36] focus:!border-[#9ABE36] focus:!bg-fresh-gray-50 2xl:!text-lg group-hover:!bg-fresh-gray-50 min-h-[42px] ${
											fieldState.error ? "!border-fresh-red-900" : ""
										}`}
										{...field}
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
				<FormTextField
					name="password"
					label={translation("Password")}
					placeholder="Make the change"
					control={control}
					type="password"
					required
				/>
				<FormTextField
					name="confirmPassword"
					label={translation("Confirm password")}
					placeholder="Make the change"
					control={control}
					type="password"
					required
				/>

				<Controller
					name="companySwitch"
					control={control}
					render={({ field }) => (
						<FormControlLabel control={<Switch {...field} />} label="Company" />
					)}
				/>
				{watchIfIsACompany && (
					<FormTextField
						name="company"
						label={translation("Company")}
						placeholder="Make the change"
						control={control}
					/>
				)}

				<div className="flex items-center">
					<Checkbox
						{...register("termsOfUse")}
						name="termsOfUse"
						color="primary"
					/>
					<span className="ml-2">
						{translation("By signing up, you agree to our")}{" "}
						<a
							href="/terms-and-conditions"
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							{translation("terms of use")}
						</a>{" "}
						{translation("and")}{" "}
						<a
							href="/privacy-policy"
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							{translation("privacy policy")}
						</a>
					</span>
				</div>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="secondary"
					className="mt-4"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Loading..." : "Signup"}
				</Button>
				<p className="text-center mt-4">
					{translation("Already have an account?")}{" "}
					<Link href="/auth/login">{translation("form.login.button")}</Link>
				</p>
			</form>
		</main>
	);
};

export default Signup;
