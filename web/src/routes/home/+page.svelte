<script lang="ts">
	import { onMount, setContext } from "svelte";
	import { Icon, Plus } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";
	import type { Atom as AtomModel } from "$lib/types";

	import Atom from "../../components/Atom.svelte";
	import Navbar from "../../components/Navbar.svelte";
	import type { PageData } from "../$types";

	export let data: PageData;

	let atoms: AtomModel[] = [];

	onMount(async () => {
		atoms = await trpc.atom.mine.query();
	});

	const createAtom = async () => {
		await trpc.atom.create.mutate({ title: "Test", time: 1 });
		atoms = await trpc.atom.mine.query();
	};

	const deleteAtom = async (id: number) => {
		await trpc.atom.delete.mutate({ id });
		atoms = await trpc.atom.mine.query();
	};

	setContext("atom", { createAtom, deleteAtom });
</script>

<Navbar user={data.user} />
<div class="px-16 py-4">
	<h1 class="mb-2 text-xl font-bold text-mauve">My Atoms</h1>
	{#each atoms as atom}
		<div class="mb-2">
			<Atom {atom} />
		</div>
	{/each}
	<button
		class="flex items-center text-overlay0 hover:text-overlay2"
		on:click={createAtom}
	>
		<Icon src={Plus} class="w-5" />New Atom
	</button>
</div>
