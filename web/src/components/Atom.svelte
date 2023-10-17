<script lang="ts">
	import { getContext } from "svelte";
	import { Icon, Trash } from "svelte-hero-icons";

	import type { Atom } from "$lib/types";

	export let atom: Atom;

	const { deleteAtom } = getContext("atom");
</script>

<div class="p-2 flex gap-2 rounded border-l-2 border-overlay0">
	<p>{atom.title}</p>
	<div class="grow"></div>
	<p>{atom.time}</p>
	<button
		class="icon-button text-surface0 hover:text-surface1"
		on:click={() => {
			deleteAtom(atom.id);
		}}
	>
		<Icon class="w-5" src={Trash} solid />
	</button>
</div>
