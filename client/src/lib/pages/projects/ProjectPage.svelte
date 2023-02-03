<script lang="ts">
    import InlineTask from "../../projects/InlineTask.svelte";
    import TaskPieChart from "../../projects/TaskPieChart.svelte";
    import { project } from "./projectStore";
</script>

<section class="container-fluid row m-0 mt-3 p-2 pt-3 bg-light d-flex flex-column-row flex-md-row">
    <div class="chart-container px-2 pb-md-4 pt-sm-2 pt-0 pb-0 d-flex flex-column align-items-center">
        <h4>Open tasks by category</h4>
        <TaskPieChart categorizeBy='category' />
    </div>
    <div class="chart-container px-2 pb-md-4 pt-sm-2 pt-0 pb-0 d-flex flex-column align-items-center">
        <h4>Tasks by status</h4>
        <TaskPieChart categorizeBy='status' />
    </div>
</section>

<h2 class="mt-3">Tasks that are due soon</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light d-flex flex-column-row flex-md-row">
    {#each $project.tasks.filter(task => !!task.dueAt).sort((a, b) => {
        return Math.round(new Date(a.dueAt).getTime() / 360000 / 24) - Math.round(new Date(b.dueAt).getTime() / 360000 / 24);
    }) as task}
        <InlineTask {task} />
    {/each}
</section>

<style>
    section {
        box-shadow: var(--container-shadow);
    }

    .chart-container {
        flex: 1;
    }
</style>