<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let secondsTilResetEnables = $state(10);
	$effect(() => {
		const interval = setInterval(() => {
			if (secondsTilResetEnables > 0) {
				secondsTilResetEnables -= 1;
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<main class="container">
	{#if form?.fail || data?.fail}
		<p class="errormessage">
			<mark>{data.fail ? 'Something went wrong with OAuth! Try again later' : form?.message}</mark>
		</p>
	{/if}
	{#if form?.passwordReset}
		<p><mark>A password reset link has been sent to you. Please check your inbox.</mark></p>
	{/if}
	<form action="?/login" method="post" use:enhance>
		<legend>Login</legend>
		<label>
			<span>Email</span>
			<input
				name="email"
				type="email"
				title="Email"
				placeholder="mail@example.com"
				aria-invalid={form?.emailRequired}
				aria-describedby="invalid-helper-email"
				required
				value={form?.email}
			/>
			{#if form?.emailRequired}
				<small id="invalid-helper-email">Please provide a valid email!</small>
			{/if}
		</label>
		<label>
			<span>Password</span>
			<input
				name="password"
				type="password"
				title="Password"
				placeholder="********"
				aria-invalid={form?.passwordRequired}
				aria-describedby="invalid-helper-password"
			/>
			{#if form?.passwordRequired}
				<small id="invalid-helper-password">Please provide a valid password!</small>
			{/if}
		</label>
		<div class="grid">
			<button class="primary" type="submit" formaction="?/login" data-tooltip="Login to your user">
				Login
			</button>
			<button
				class="secondary"
				type="submit"
				formaction="?/register"
				data-tooltip="Create a new user"
			>
				Register
			</button>
			<button
				type="submit"
				class="outline secondary"
				formaction="?/reset"
				data-tooltip="Request a reset of your password, please check your Email"
				disabled={form?.passwordReset || secondsTilResetEnables > 0}
			>
				Reset password {secondsTilResetEnables > 0 ? `(${secondsTilResetEnables})` : ''}
			</button>
		</div>
	</form>
	<hr />
	{#if data?.providers?.length > 0}
		<form class="oauth" method="post" use:enhance>
			<legend>OAuth</legend>
			<fieldset>
				{#each data.providers as provider}
					<button
						name={provider.authURL}
						type="submit"
						aria-label={provider.name}
						data-tooltip={`Login with ${provider.displayName}`}
						formaction="?/oauth&provider={provider.name}">{provider.displayName}</button
					>
				{/each}
			</fieldset>
		</form>
	{/if}
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
	main.container p.errormessage mark {
		background-color: var(--pico-form-element-invalid-border-color);
	}
</style>
