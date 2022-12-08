<script lang="ts">
	import { Route } from "svelte-router-spa";
	import Navbar from "./nav/Navbar.svelte";
    
	export let currentRoute;

	const params = {}
</script>

<Navbar />
<div class="main-layout-container">
	<Route {currentRoute} {params} />
</div>

<style>
	.main-layout-container {
		margin-left: 4rem;
		padding: 0.25rem 0.5rem;
	}
</style>
