<script lang="ts">
	import { getContext } from "svelte";
	import { Icon, Pause, Play, Trash } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";
	import type { Atom } from "$lib/types";

	export let atom: Atom;

	let time = atom.time_current;
	let running = false;
	let clock: ReturnType<typeof setTimeout>;

	const pad = (x: number) => String(x).padStart(2, "0");

	const complete = () => {
		new Notification(`⚛ ${atom.title} complete! ⚛`);

		stop();
	};

	const start = () => {
		clock = setInterval(() => {
			--time;

			if (time === 0) complete();
		}, 1000);

		running = true;
	};

	const stop = async () => {
		clearInterval(clock);

		await trpc.atom.updateTime.mutate({ id: atom.id, time });

		running = false;
	};

	// @ts-expect-error: no type inference
	const { deleteAtom } = getContext("atom");
</script>

<div
	class={`p-2 flex gap-2 bg-base rounded border-l-2 ${
		running ? "border-green" : "border-overlay0"
	}`}
>
	<p class={time === 0 ? "text-overlay0 line-through" : ""}>{atom.title}</p>
	<div class="grow"></div>
	<p class={time === 0 ? "text-overlay0" : ""}>
		{Math.floor(time / 3600)}:{pad(Math.floor(time / 60) % 60)}:{pad(time % 60)}
	</p>
	<button
		disabled={time === 0}
		on:click={() => {
			running ? stop() : start();
		}}
	>
		<Icon
			class={`w-6 h-6 p-1 rounded-full bg-surface0 ${
				time === 0 ? "text-surface2" : "hover:text-green"
			}`}
			src={running ? Pause : Play}
			solid
		/>
	</button>
	<button
		class="icon-button text-surface0 hover:text-maroon"
		on:click={() => {
			deleteAtom(atom.id);
		}}
	>
		<Icon class="w-5" src={Trash} solid />
	</button>
</div>
