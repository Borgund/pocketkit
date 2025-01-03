<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import '@picocss/pico';

	let { data, children }: { data: PageData; children: Snippet } = $props();
</script>

<Header user={data.user} />
{@render children()}
