<script lang="ts">
	import { setContext } from "svelte";
	import { Route } from "svelte-router-spa";
	import { writable } from "svelte/store";
	import { onMount } from "svelte";
	import Header from "./nav/Header.svelte";
	import Navbar from "./nav/Navbar.svelte";
	import getTaskSeveritiesPrioritiesStatuses from "./utilities/getTaskSeveritiesPrioritiesStatuses";
	import { taskSeverities, taskPriorities, taskStatuses } from "./pages/projects/projectStore";
    
	export let currentRoute;

	const bottomPadding = writable(6);
	setContext('layoutBottomPadding', bottomPadding);

	$: if(currentRoute.path) {
		bottomPadding.set(4);
	}

	onMount(async () => {
		if($taskSeverities.length === 0 || $taskPriorities.length === 0 || $taskStatuses.length === 0) {
			const data = await getTaskSeveritiesPrioritiesStatuses();
			taskSeverities.set(data.severities);
			taskPriorities.set(data.priorities);
			taskStatuses.set(data.statuses);
		}
	});

	const params = {}
</script>

<Header />
<Navbar />
<div class="main-layout-container h-100" style="padding-bottom: {$bottomPadding}rem !important">
	<Route {currentRoute} {params} />
</div>

<style>
	.main-layout-container {
		min-height: fit-content;
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
