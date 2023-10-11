<script lang="ts">
	import { Home, Icon, Moon, Sun } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";

	export let darkMode: boolean;

	const toggleDarkMode = async () => {
		darkMode = await trpc.user.toggleDarkMode.mutate();

		if (darkMode) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	};

	const signIn = async () => {
		await trpc.user.signIn.query({ email: "bob@bob.com", password: "1234" });
	};
</script>

<nav class="px-8 py-2 flex gap-x-2 bg-base">
	<button
		class="icon-button hover:text-blue"
		on:click={() => window.location.assign("/home")}
	>
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
