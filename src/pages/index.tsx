import { useTranslation } from "next-i18next";
import Head from "next/head";

export { getStaticProps } from "../../server-translation";

export default function Home() {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="pt-5 min-h-[calc(100vh-64px)]">
				<h1 className="text-4xl font-bold">{t("home.title")} :)</h1>
			</main>
		</>
	);
}
