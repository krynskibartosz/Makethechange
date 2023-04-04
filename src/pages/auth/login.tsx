export { getStaticProps } from "../../../server-translation";

import useRootStore from "@/store/useRoot";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as yup from "yup";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography, Button } from "@mui/material";
import { UserData } from "@/interfaces/user";
import { FormTextField } from "@/components/forms/TextField";
import {
	fetchUserData,
	getFirebaseLoginErrorMessage,
} from "@/features/auth/login/login";
import { User } from "firebase/auth";

const Login = () => {
	const { login, user } = useRootStore.getState();
	const { t: translation } = useTranslation();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const schema = yup.object().shape({
		email: yup
			.string()
			.required(translation("L'email est requis") as string)
			.email(),
		password: yup
			.string()
			.required(translation("Le mot de passe est requis") as string)
			.min(8, translation("il faut min 8 car") as string),
	});
	const { handleSubmit, control, setError } = useForm({
		resolver: yupResolver(schema),
	});

	const handleLoginError = (error: any) => {
		const errorMessage = getFirebaseLoginErrorMessage(error.code);
		setError("email", { type: "manual", message: errorMessage });
	};

	const storeUserDataInCache = async (user: User, userLoginData: UserData) => {
		const idTokenResult = await user.getIdTokenResult();
		const accessToken = idTokenResult.token;
		const refreshToken = user.refreshToken;

		login({
			user: {
				auth: {
					isAuth: true,
					accessToken: accessToken,
					refreshToken: refreshToken,
				},
				data: userLoginData,
			},
		});
	};

	const handleLoginFormSubmit: SubmitHandler<FieldValues> = async (data) => {
		const { email, password } = data as UserData;
		setIsSubmitting(true);
		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const userData = await fetchUserData(user);
			await storeUserDataInCache(user, { ...userData });

			router.push("/dashboard");
		} catch (error: any) {
			setIsSubmitting(false);
			handleLoginError(error);
		}
	};

	useEffect(() => {
		if (user.auth.isAuthenticated) router.push("/dashboard");
	}, [router, user.auth.isAuthenticated]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<form
				onSubmit={handleSubmit(handleLoginFormSubmit)}
				className="w-full max-w-md gap-y-5 flex flex-col"
			>
				<Typography variant="h4" component="h1" className="mb-6">
					Login
				</Typography>
				<FormTextField
					name="email"
					label={translation("Email")}
					placeholder="Make the change"
					control={control}
					type="email"
					required
				/>
				<FormTextField
					name="password"
					label={translation("Password")}
					placeholder="Make the change"
					control={control}
					type="password"
					required
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					disabled={isSubmitting}
				>
					{isSubmitting ? "Loading..." : "Login"}
				</Button>
			</form>

			<Link href="/auth/signup" className="pt-5">
				Pas encore de compte ? Inscrivez-vous{" "}
			</Link>
		</div>
	);
};

export default Login;
