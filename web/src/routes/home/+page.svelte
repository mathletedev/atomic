<script lang="ts">
	import { Icon, Plus } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";

	import Navbar from "../../components/Navbar.svelte";

	let hello = "";

	const loadData = async () => {
		hello = await trpc.hello.query();
	};
</script>

<Navbar />
<div class="px-16 py-4">
	<h1 class="text-xl font-bold text-mauve">My Atoms</h1>
	<p>{hello}</p>
	<button
		class="flex items-center text-overlay0 hover:text-overlay2"
		on:click={loadData}
	>
		<Icon src={Plus} class="w-5" />New Atom
	</button>
</div>
