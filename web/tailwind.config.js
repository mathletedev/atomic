const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Quicksand", ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [require("@catppuccin/tailwindcss")],
	darkMode: "class"
};
