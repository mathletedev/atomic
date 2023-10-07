<script lang="ts">
	import { Home, Icon, Moon, Sun } from "svelte-hero-icons";

	import { browser } from "$app/environment";

	const home = () => {
		window.location.assign("/");
	};

	let darkMode = false;

	const applyTheme = () => {
		if (darkMode) document.querySelector("html")!.classList.add("dark");
		else document.querySelector("html")!.classList.remove("dark");
	};

	const toggleDarkMode = () => {
		darkMode = !darkMode;
		applyTheme();

		localStorage.setItem("theme", darkMode ? "dark" : "light");
	};

	if (browser) {
		darkMode =
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		applyTheme();
	}
</script>

<nav class="px-8 py-2 flex gap-x-2 bg-base">
	<button class="icon-button hover:text-blue" on:click={home}>
		<Icon src={Home} solid class="w-6" />
	</button>
	<div class="grow"></div>
	<button class="icon-button hover:text-yellow" on:click={toggleDarkMode}>
		<Icon src={darkMode ? Moon : Sun} solid class="w-6" />
	</button>
	<button class="px-2 py-1 bg-surface0 hover:bg-surface1 rounded">
		Sign in
	</button>
</nav>
