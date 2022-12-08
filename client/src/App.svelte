<script lang="ts">
	import { Router } from 'svelte-router-spa';
	import { routes } from './routes';

	import Navbar from './lib/nav/Navbar.svelte';
</script>

<Navbar />
<main>
	<Router routes={routes} />
</main>

<style>

</style>