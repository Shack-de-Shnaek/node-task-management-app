<script lang="ts">
	import getTaskSeveritiesPrioritiesStatuses from "../../utilities/getTaskSeveritiesPrioritiesStatuses";
	import { onMount } from "svelte";
	import type { TaskPriorityData, TaskSeverityData, TaskStatusData } from "../../../../../interfaces/TaskData";
    import { project } from "./projectStore";

    let severities: TaskSeverityData[];
    let priorities: TaskPriorityData[];
    let statuses: TaskStatusData[];

    onMount(async() => {
        const data = await getTaskSeveritiesPrioritiesStatuses();
        console.log(data);
        severities = data.severities;
        priorities = data.priorities;
        statuses = data.statuses;
    });
</script>

<h2>
    tasks
</h2>