<script lang="ts">
	import { Route } from "svelte-router-spa";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { writable } from "svelte/store";
	import Header from "./nav/Header.svelte";
	import Navbar from "./nav/Navbar.svelte";
	import NavButton from "./nav/NavButton.svelte";
    
	export let currentRoute;
	
	const getBottomPadding = () => {
		if(currentRoute.path.startsWith('/projects') && (currentRoute.path.endsWith('tasks') || currentRoute.path.endsWith('tasks/'))) return 0;
		return 6;
	}

	const bottomPadding = writable(6);
	$: if(currentRoute) {
		bottomPadding.set(getBottomPadding());
	}

	const params = {}
</script>

<Header />
<Navbar />
<div class="main-layout-container" style="padding-bottom: {$bottomPadding}rem">
	<Route {currentRoute} {params} />
</div>

<style>
	.main-layout-container {
		min-height: 100%;
		height: fit-content;
		margin-left: 4rem;
		padding: 0.25rem 0.5rem;
		/* padding-bottom: 6rem; */
	}

	@media only screen and (max-width: 577px) {
		.main-layout-container {
			margin-left: 0;
			margin-bottom: 4rem;
		}
	}
</style>
