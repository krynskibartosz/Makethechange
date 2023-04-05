import { initializeApp } from "firebase/app";

import { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/reset.css";

import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";

import {
	ThemeProvider,
	createTheme,
	makeStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
	root: {
		// some CSS that accesses the theme
	}
});

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const app = initializeApp(firebaseConfig);

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

export default appWithTranslation(MyApp, nextI18NextConfig);
