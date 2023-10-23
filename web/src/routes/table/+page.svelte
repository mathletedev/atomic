<script lang="ts">
	import { onMount } from "svelte";

	import { trpc } from "$lib/trpc";
	import type { History } from "$lib/types";

	import Navbar from "../../components/Navbar.svelte";
	import type { PageData } from "../$types";

	export let data: PageData;

	let table: History[] = [];

	onMount(async () => {
		if (!data.user) window.location.assign("/");

		await trpc.user.update.mutate();
		table = await trpc.histories.mine.query();
	});
</script>

<Navbar user={data.user} />
