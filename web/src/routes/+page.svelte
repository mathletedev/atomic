<script lang="ts">
	import { trpc } from "$lib/trpc";

	import Navbar from "../components/Navbar.svelte";

	let email = "";
	$: trpc.user.me.query().then(user => {
		email = user.email;
	});
</script>

<Navbar />
<div class="px-16 py-4">
	<p>{email}</p>
</div>
