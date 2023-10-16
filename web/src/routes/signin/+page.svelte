<script lang="ts">
	import { trpc } from "$lib/trpc";

	let email = "";
	let password = "";

	const signIn = async () => {
		try {
			await trpc.user.signIn.query({ email, password });
			window.location.assign("/home");
		} catch (err) {
			alert("Email or password is invalid");
		}
	};
</script>

<div class="h-screen flex">
	<form
		class="w-1/2 min-w-[256px] max-w-[512px] m-auto flex flex-col gap-4"
		on:submit={signIn}
	>
		<h1 class="text-center text-4xl">Sign in</h1>
		<input placeholder="Email" type="email" required bind:value={email} />
		<input
			placeholder="Password"
			type="password"
			required
			bind:value={password}
		/>
		<button class="p-2 bg-surface0 hover:bg-surface1 rounded"> Submit </button>
	</form>
</div>
