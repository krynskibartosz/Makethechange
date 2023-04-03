/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./src/features/**/*.{js,ts,jsx,tsx}",
		"./src/hooks/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				"max-2xl": { max: "1535px" },
				"max-xl": { max: "1279px" },
				"max-lg": { max: "1024px" },
				"max-md": { max: "768px" },
				"max-sm": { max: "639px" },
			},
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
