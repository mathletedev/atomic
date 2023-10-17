<script lang="ts">
	import { Home, Icon, Moon, Sun } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";
	import type { User } from "$lib/types";

	export let user: User | undefined;

	let darkMode: boolean;
	if (user) darkMode = user.dark_mode;

	const toggleDarkMode = async () => {
		darkMode = await trpc.user.toggleDarkMode.mutate();

		if (darkMode) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	};

	const signOut = async () => {
		await trpc.user.signOut.query();
		window.location.assign("/");
	};
</script>

<nav class="px-8 py-2 flex items-center gap-x-2 bg-base">
	{#if user}
		<a class="icon-button hover:text-sapphire" href="/home">
			<Icon class="w-6" src={Home} solid />
		</a>
	{/if}
	<a class="text-2xl font-bold" href="/">
		<span class="text-sapphire">A</span>tomic
	</a>
	<div class="grow"></div>
	{#if user}
		<button class="icon-button hover:text-yellow" on:click={toggleDarkMode}>
			<Icon class="w-6" src={darkMode ? Moon : Sun} solid />
		</button>
		<button
			class="px-2 py-1 bg-surface0 hover:bg-surface1 rounded"
			on:click={signOut}
		>
			Sign out
		</button>
	{:else}
		<a class="px-2 py-1 bg-surface0 hover:bg-surface1 rounded" href="/signin">
			Sign in
		</a>
	{/if}
</nav>
