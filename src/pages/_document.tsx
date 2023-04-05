import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html>
			<Head>
				<script
					async
					defer
					src="https://connect.facebook.net/en_US/sdk.js"
				></script>
			</Head>{" "}
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
