import { initializeApp } from "firebase/app";

import { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/reset.css";

import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";

import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';

import Link from "next/link";
import { useRouter } from "next/router";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const app = initializeApp(firebaseConfig);

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const links = [
		{ name: "Accueil", link: "/" },
		{ name: "Se connecter", link: "/auth/login" },
		{ name: "S'inscrire", link: "/auth/signup" },
	];

	// Vérifier si l'utilisateur est sur la route "admin"
	const isAdminRoute = router.pathname.startsWith("/admin");

	// Si l'utilisateur est sur la route "admin", ne pas afficher le header
	if (isAdminRoute) {
		return (
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		);
	}
	return (
		<>
			<ThemeProvider theme={theme}>
				<header className="w-full py-5 px-10">
					<nav className="gap-x-10 flex">
						{links.map((el, i) => (
							<Link className="text-blue-500 underline" key={i} href={el.link}>
								{el.name}
							</Link>
						))}
					</nav>
				</header>
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

export default appWithTranslation(MyApp, nextI18NextConfig);
