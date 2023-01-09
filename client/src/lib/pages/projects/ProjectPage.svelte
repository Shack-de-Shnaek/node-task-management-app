<script lang="ts">
	import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";

    const project: Writable<ProjectData> = getContext('project');
</script>

<h1>{$project.name}</h1>
