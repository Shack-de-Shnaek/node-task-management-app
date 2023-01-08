<script lang="ts">
	import { Route } from "svelte-router-spa";
	import Header from "./nav/Header.svelte";
	import Navbar from "./nav/Navbar.svelte";
	import NavButton from "./nav/NavButton.svelte";
    
	export let currentRoute;

	const params = {}
</script>

<Header />
<Navbar />
<div class="main-layout-container">
	<Route {currentRoute} {params} />
</div>

<style>
	.main-layout-container {
		margin-left: 4rem;
		padding: 0.25rem 0.5rem;
	}

	@media only screen and (max-width: 576px) {
		.main-layout-container {
			margin-left: 0;
			margin-bottom: 4rem;
		}
	}
</style>
