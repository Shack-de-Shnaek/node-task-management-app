<script lang="ts">
	import { Router } from 'svelte-router-spa';
	import { writable } from 'svelte/store';
	import { onMount, setContext } from 'svelte';
	import { routes } from './routes';
	import { currentUserHasBeenRequested } from './store';
	import getCurrentUser from './lib/utilities/getCurrentUser';

	let windowWidth = writable(0);
	setContext('windowWidth', windowWidth);

	onMount(async () => {
		if(window.location.pathname === '/login') return;
		getCurrentUser();
		currentUserHasBeenRequested.set(true);
	});
</script>
<svelte:window bind:innerWidth={$windowWidth} />

<Router routes={routes} />

<style>

</style>