<script lang="ts">
	import { Router } from 'svelte-router-spa';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { routes } from './routes';

	let windowWidth = writable(0);
	setContext('windowWidth', windowWidth);
</script>

<svelte:window bind:innerWidth={$windowWidth} />

<main>
	<Router routes={routes} />
</main>

<style>

</style>