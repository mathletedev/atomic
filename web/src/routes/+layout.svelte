<script lang="ts">
	import "../app.css";

	import { onMount } from "svelte";

	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	onMount(() => {
		if (data.darkMode) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	});
</script>

<slot />
