<script lang="ts">
	import { trpc } from "$lib/trpc";

	import Navbar from "../components/Navbar.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	let email = "";
	$: trpc.user.me
		.query()
		.then(user => {
			email = user.email;
		})
		.catch(() => {});
</script>

<Navbar darkMode={data.darkMode} />
<div class="px-16 py-4">
	<p>{email}</p>
</div>
