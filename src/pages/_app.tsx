import { initializeApp } from "firebase/app";

import { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/reset.css";

import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";

import { ThemeProvider } from "@mui/styles";

import { useRouter } from "next/router";

import { Sidebar } from "@/features/admin/Sidebar";
import { createTheme } from "@mui/material/styles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { AdminNavbar } from "@/features/admin/Navbar";
import { AppNavbar } from "@/features/app/Navbar";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const app = initializeApp(firebaseConfig);

const theme = createTheme({
	palette: {
		primary: {
			main: "#9abe36",
		},
		secondary: {
			main: "#fcb328",
		},
	},
});

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const isAdminRoute = router.pathname.startsWith("/admin");

	if (isAdminRoute) {
		return (
			<div className="bg-gray-50">
				<CssVarsProvider>
					<ThemeProvider theme={theme}>
						<AdminNavbar />
						<Sidebar />
						<div className="ml-[240px] min-h-[calc(100vh-65px)] pb-20">
							<Component {...pageProps} />
						</div>
					</ThemeProvider>
				</CssVarsProvider>
			</div>
		);
	}
	return (
		<>
			<div className="bg-gray-50 ">
				<CssVarsProvider>
					<ThemeProvider theme={theme}>
						<AppNavbar />
						<Component {...pageProps} />
					</ThemeProvider>
				</CssVarsProvider>
			</div>
		</>
	);
};

export default appWithTranslation(MyApp, nextI18NextConfig);
