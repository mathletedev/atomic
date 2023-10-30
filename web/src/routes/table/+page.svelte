<script lang="ts">
	import { onMount } from "svelte";
	import { ChevronLeft, ChevronRight, Icon } from "svelte-hero-icons";

	import { trpc } from "$lib/trpc";
	import type { History } from "$lib/types";

	import Navbar from "../../components/Navbar.svelte";
	import type { PageData } from "../$types";

	interface Cell {
		total: number;
		completed: number;
		colour: string;
	}

	export let data: PageData;

	let histories: History[] = [];
	let table: Record<string, Cell> = {};

	onMount(async () => {
		if (!data.user) window.location.assign("/");

		await trpc.user.update.mutate();
		histories = await trpc.histories.mine.query();
	});

	let date = new Date();
	date = new Date(date.getFullYear(), date.getMonth(), 1);
	let dates: string[] = [];

	const update = () => {
		table = {};
		for (const history of histories) {
			const frac = history.completed / history.total;
			table[history.date.toString()] = {
				total: history.total,
				completed: history.completed,
				colour: frac < 0.5 ? "red" : frac < 1 ? "peach" : "sapphire"
			};
		}

		let year = date.getFullYear();
		let month = date.getMonth();
		let firstDay = new Date(year, month, 1);
		let lastDay = new Date(year, month + 1, 0);
		dates = [];
		for (let i = 0; i < firstDay.getDay(); ++i) dates.push("");
		for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1))
			dates.push(i.toISOString());
		for (let i = dates.length; i <= 7 * 5; ++i) dates.push("");
	};

	$: date, histories, update();

	const nextMonth = () => {
		date.setMonth(date.getMonth() + 1);
		date = date;
	};

	const prevMonth = () => {
		date.setMonth(date.getMonth() - 1);
		date = date;
	};
</script>

<Navbar user={data.user} />
<div class="bg-red"></div>
<div class="bg-peach"></div>
<div class="bg-sapphire"></div>
<div class="h-[calc(100vh-48px)] flex">
	<div class="m-auto">
		<div class="mb-8 flex">
			<button class="icon-button hover:text-sapphire" on:click={prevMonth}>
				<Icon class="w-6" src={ChevronLeft} solid />
			</button>
			<h1 class="flex-grow text-center text-4xl font-bold text-mauve">
				{date.toLocaleString("en-US", { month: "long" })}
				{date.getFullYear()}
			</h1>
			<button class="icon-button hover:text-sapphire" on:click={nextMonth}>
				<Icon class="w-6" src={ChevronRight} solid />
			</button>
		</div>
		<div class="grid grid-cols-7 gap-4">
			{#each dates as date}
				<div
					class={`z-10 w-16 h-16 flex rounded-lg bg-${
						date === "" ? "mantle" : table[date]?.colour || "base"
					} group ${!table[date] ? "" : "hover:bg-surface0"}`}
				>
					{#if table[date]}
						<p
							class="m-auto opacity-0 group-hover:opacity-100 transition-opacity"
						>
							{table[date].completed}/{table[date].total}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
