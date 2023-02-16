<script lang="ts">
	import { setContext } from "svelte";
	import { Route } from "svelte-router-spa";
	import { writable } from "svelte/store";
	import Header from "./nav/Header.svelte";
	import Navbar from "./nav/Navbar.svelte";
    
	export let currentRoute;

	const bottomPadding = writable(6);
	setContext('layoutBottomPadding', bottomPadding);

	$: if(currentRoute.path) {
		bottomPadding.set(6);
	}

	const params = {}
</script>

<Header />
<Navbar />
<div class="main-layout-container h-100" style="padding-bottom: {$bottomPadding}rem !important">
	<Route {currentRoute} {params} />
</div>

<style>
	.main-layout-container {
		margin-left: 4rem;
		padding: 0.25rem 0.5rem;
	}

	@media only screen and (max-width: 577px) {
		.main-layout-container {
			margin-left: 0;
			margin-bottom: 4rem;
		}
	}
</style>
