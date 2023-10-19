<script lang="ts">
	import { onMount, setContext } from "svelte";
	import { Backspace, Icon, PaperAirplane, Plus } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";
	import type { Atom as AtomModel } from "$lib/types";
	import { focus } from "$lib/utils";

	import Atom from "../../components/Atom.svelte";
	import Navbar from "../../components/Navbar.svelte";
	import type { PageData } from "../$types";

	export let data: PageData;

	let atoms: AtomModel[] = [];
	let newAtom = {
		title: "",
		time: 60
	};
	let isCreating = false;

	const resetInput = () => {
		newAtom = {
			title: "",
			time: 60
		};
		isCreating = false;
	};

	const syncAtoms = async () => {
		atoms = await trpc.atom.mine.query();
	};

	onMount(async () => {
		if (!data.user) window.location.assign("/");

		await syncAtoms();

		if (Notification.permission !== "granted") Notification.requestPermission();
	});

	const createAtom = async () => {
		await trpc.atom.create.mutate(newAtom);
		await syncAtoms();

		resetInput();
	};

	const deleteAtom = async (id: number) => {
		if (!confirm("Are you sure you want to delete this Atom?")) return;

		await trpc.atom.delete.mutate({ id });
		await syncAtoms();
	};

	setContext("atom", { createAtom, deleteAtom });

	const refresh = async () => {
		await trpc.atom.refresh.mutate();
		await syncAtoms();
	};
</script>

<Navbar user={data.user} />
<div class="mx-auto px-16 py-4 max-w-[1024px]">
	<h1 class="mb-2 text-xl font-bold text-mauve">My Atoms</h1>
	{#each atoms as atom}
		<div class="mb-2">
			<Atom {atom} />
		</div>
	{/each}
	{#if isCreating}
		<form class="flex gap-2" on:submit={createAtom}>
			<button class="p-2 bg-base hover:text-sapphire rounded">
				<Icon class="w-5" src={PaperAirplane} solid />
			</button>
			<input
				class="w-full"
				placeholder="Title"
				required
				bind:value={newAtom.title}
				use:focus
			/>
			<div class="relative">
				<input
					class="w-24"
					type="number"
					max={1440}
					min={1}
					required
					bind:value={newAtom.time}
				/>
				<span class="absolute right-2 top-2 text-overlay0">min</span>
			</div>
			<button
				class="p-2 bg-base hover:text-maroon rounded"
				on:click={resetInput}
			>
				<Icon class="w-5" src={Backspace} solid />
			</button>
		</form>
	{:else}
		<button
			class="flex items-center text-overlay0 hover:text-overlay2"
			on:click={() => {
				isCreating = true;
			}}
		>
			<Icon class="w-5" src={Plus} solid />New Atom
		</button>
	{/if}
	<button on:click={refresh}>Refresh</button>
</div>
