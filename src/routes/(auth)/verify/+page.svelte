<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let secondsTilResendEnables = $state(10);
	$effect(() => {
		const interval = setInterval(() => {
			if (secondsTilResendEnables > 0) {
				secondsTilResendEnables -= 1;
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<main class="container-fluid">
	{#if form?.fail}
		<p class="errormessage">
			<mark>{data.fail ? 'Something went wrong with OAuth! Try again later' : form?.message}</mark>
		</p>
	{/if}
	<form method="post">
		<legend>Please verify your Email address</legend>
		{#if !form?.requestSent}
			<button formaction="?/verify" disabled={form?.requestSent || secondsTilResendEnables > 0}>
				Resend verification Email {secondsTilResendEnables > 0
					? `(${secondsTilResendEnables})`
					: ''}</button
			>
		{/if}
		<button formaction="?/logout">Logout</button>
	</form>
</main>

<style>
	main form {
		max-width: 120rem;
	}
	form legend {
		margin: 1rem;
		font-size: 1.5rem;
		text-align: center;
	}
	main.container-fluid p.errormessage mark {
		background-color: var(--pico-form-element-invalid-border-color);
	}
</style>
