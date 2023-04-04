export { getStaticProps } from "../../../server-translation";

import useRootStore from "@/store/useRoot";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";

import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography, TextField, Button } from "@mui/material";
import { app } from "../_app";
import { UserData } from "@/interfaces/user";

const firestoreDB = getFirestore(app);

const getFirebaseErrorMessage = (errorCode: string) => {
	switch (errorCode) {
		case "auth/user-disabled":
			return "Your account has been disabled. Please contact support.";
		case "auth/wrong-password":
			return "The email or password you entered is incorrect. Please try again.";
		case "auth/user-not-found":
			return "The email you entered is not associated with an account. Please check your email address or sign up for a new account.";
		case "auth/too-many-requests":
			return "Too many login attempts. Please try again later.";
		default:
			return "An error occurred while processing your request. Please try again later.";
	}
};

const Login = () => {
	const { login, user } = useRootStore.getState();
	const { t } = useTranslation();

	const schema = yup.object().shape({
		email: yup
			.string()
			.required(t("L'email est requis") as string)
			.email(),
		password: yup
			.string()
			.required(t("Le mot de passe est requis") as string)
			.min(8, t("il faut min 8 car") as string),
	});
	const { handleSubmit, formState, control, setError } = useForm({
		resolver: yupResolver(schema),
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleLoginFormSubmit: SubmitHandler<FieldValues> = async (data) => {
		const { email, password } = data as UserData;
		setIsSubmitting(true);
		const auth = getAuth();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const idTokenResult = await user.getIdTokenResult();
			const accessToken = idTokenResult.token;
			const refreshToken = user.refreshToken;

			// Get additional user data from Firestore
			const userDataDoc = await getDoc(doc(firestoreDB, "users", user.uid));
			const userData = userDataDoc.data() as UserData;

			login({
				user: {
					auth: {
						isAuth: true,
						accessToken: accessToken,
						refreshToken: refreshToken,
					},
					data: userData,
				},
			});
			router.push("/dashboard");
		} catch (error: any) {
			setIsSubmitting(false);
			const errorMessage = getFirebaseErrorMessage(error.code);
			setError("email", { type: "manual", message: errorMessage });
		}
	};

	useEffect(() => {
		if (user.auth.isAuthenticated) router.push("/dashboard");
	}, [router]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<form
				onSubmit={handleSubmit(handleLoginFormSubmit)}
				className="w-full max-w-md gap-y-5 flex flex-col"
			>
				<Typography variant="h4" component="h1" className="mb-6">
					Login
				</Typography>
				<Controller
					name="email"
					control={control}
					defaultValue=""
					rules={{ required: "Email is required" }}
					render={({ field: { value, onChange }, fieldState: { error } }) => (
						<TextField
							label="Email"
							variant="outlined"
							margin="normal"
							required
							fullWidth
							value={value}
							onChange={onChange}
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				<Controller
					name="password"
					control={control}
					defaultValue=""
					rules={{ required: "Password is required" }}
					render={({ field: { value, onChange }, fieldState: { error } }) => (
						<TextField
							label="Password"
							variant="outlined"
							margin="normal"
							required
							fullWidth
							value={value}
							onChange={onChange}
							type="password"
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					disabled={isSubmitting}
				>
					{isSubmitting ? "isSubmitting..." : "Login"}
				</Button>
			</form>

			<Link href="/auth/signup" className="pt-5">
				Pas encore de compte ? Inscrivez-vous{" "}
			</Link>
		</div>
	);
};

export default Login;
