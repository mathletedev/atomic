<script lang="ts">
	import { trpc } from "$lib/trpc";

	let email = "";
	let password = "";

	const signUp = async () => {
		try {
			await trpc.user.create.mutate({ email, password });
			await trpc.user.signIn.query({ email, password });
			window.location.assign("/home");
		} catch (err) {
			switch ((err as Error).message) {
				case "CONFLICT":
					alert("Email is associated with another account");
					break;
				case "BAD_REQUEST":
					alert(
						"Password must be 6 to 20 characters long and contain at least one numeric, uppercase, and lowercase character"
					);
			}
		}
	};
</script>

<div class="h-screen flex">
	<form
		class="w-1/2 min-w-[256px] max-w-[512px] m-auto flex flex-col gap-4"
		on:submit={signUp}
	>
		<h1 class="text-center text-4xl">Sign up</h1>
		<input placeholder="Email" type="email" required bind:value={email} />
		<input
			placeholder="Password"
			type="password"
			required
			bind:value={password}
		/>
		<button class="p-2 bg-surface0 hover:bg-surface1 rounded">Submit</button>
		<p class="text-center text-sm">
			Already have an account?
			<a class="text-lavender underline" href="/signin">Sign in</a>
		</p>
	</form>
</div>
