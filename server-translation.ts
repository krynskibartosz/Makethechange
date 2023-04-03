import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "./next-i18next.config";

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"], nextI18NextConfig)),
		},
	};
};
