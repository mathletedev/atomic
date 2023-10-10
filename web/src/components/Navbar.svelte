<script lang="ts">
	import { Home, Icon, Moon, Sun } from "svelte-hero-icons";

	import { browser } from "$app/environment";
	import { trpc } from "$lib/trpc";

	const applyTheme = () => {
		if (darkMode) document.querySelector("html")!.classList.add("dark");
		else document.querySelector("html")!.classList.remove("dark");
	};

	let darkMode = false;

	if (browser) {
		darkMode =
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		applyTheme();
	}

	const home = () => {
		window.location.assign("/");
	};

	const toggleDarkMode = () => {
		darkMode = !darkMode;
		applyTheme();

		localStorage.setItem("theme", darkMode ? "dark" : "light");
	};

	const signIn = async () => {
		await trpc.user.signIn.query({ email: "bob@bob.com", password: "1234" });
	};
</script>

<nav class="px-8 py-2 flex gap-x-2 bg-base">
	<button class="icon-button hover:text-blue" on:click={home}>
		<Icon src={Home} solid class="w-6" />
	</button>
	<div class="grow"></div>
	<button class="icon-button hover:text-yellow" on:click={toggleDarkMode}>
		<Icon src={darkMode ? Moon : Sun} solid class="w-6" />
	</button>
	<button
		class="px-2 py-1 bg-surface0 hover:bg-surface1 rounded"
		on:click={signIn}
	>
		Sign in
	</button>
</nav>
