<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Navbar user={data.user} />
<div class="px-16 py-4">
	<p>{data.user ? data.user.email : "Hello, world!"}</p>
</div>
