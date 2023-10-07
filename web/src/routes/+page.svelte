<script lang="ts">
	import { Icon, Plus } from "svelte-hero-icons";

	import Navbar from "../components/Navbar.svelte";
</script>

<Navbar />
<div class="px-16 py-4">
	<h1 class="text-xl font-bold text-mauve">My Atoms</h1>
	<button class="flex items-center text-overlay0 hover:text-overlay2">
		<Icon src={Plus} class="w-5" />New Atom
	</button>
</div>
