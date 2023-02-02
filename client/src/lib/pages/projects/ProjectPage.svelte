<script lang="ts">
    import TaskPieChart from "../../projects/TaskPieChart.svelte";
    import { project } from "./projectStore";
</script>

<section class="container-fluid row m-0 mt-3 p-2 pt-3 bg-light d-flex flex-row">
    <div style="flex-1">
        <TaskPieChart categorizeBy='category' />
    </div>
    <div style="flex-1">
        <TaskPieChart categorizeBy='status' />
    </div>
</section>

<style>
    section {
        box-shadow: var(--container-shadow);
    }
</style>