<script lang="ts">
	import type { TaskData } from "../../../../../interfaces/TaskData";
	import { currentUserData } from "../../../store";
    import InlineTask from "../../tasks/InlineTask.svelte";
    import TaskPieChart from "../../projects/TaskPieChart.svelte";
    import { project } from "./projectStore";

    const getDueSoonTasks = () => {
        return $project.tasks.filter(task => {
            if(!task.dueAt) return false;
            const delta = Math.round((new Date(task.dueAt).getTime() - new Date().getTime()) / 1000 / 3600 / 24);
            return delta < 7;
        }).sort((a, b) => {
            const days1 = Math.round(new Date(a.dueAt).getTime() / 360000 / 24);
            const days2 = Math.round(new Date(b.dueAt).getTime() / 360000 / 24)
            return days1 - days2;
        });
    }

    const getCurrentUserTasks = () => {
        return $project.tasks.filter(task => {
            if(!task.assignedTo) return false;
            if(task.status.code === 'fixed' || task.status.code === 'rejected') return false;
            return task.assignedTo.id === $currentUserData.id;
        });
    }

    let dueSoonTasks: TaskData[] = [];
    let currentUserTasks: TaskData[] = [];
    $: if($project.id !== 0) {
        dueSoonTasks = getDueSoonTasks();
        currentUserTasks = getCurrentUserTasks();
    }
</script>

{#key $project.id}
    {#if $project.id !== 0 && $project.tasks.length > 0}
        <section class="section row mt-3 d-flex flex-column-row flex-md-row justify-content-center">
            <div class="chart-container px-2 pb-md-4 pt-sm-2 pt-0 pb-0 d-flex flex-column align-items-center">
                <h4>Open tasks by category</h4>
                <TaskPieChart categorizeBy='category' />
            </div>
            <div class="chart-container px-2 pb-md-4 pt-sm-2 pt-0 pb-0 d-flex flex-column align-items-center">
                <h4>Tasks by status</h4>
                <TaskPieChart categorizeBy='status' />
            </div>
        </section>
    {/if}
{/key}

<h2 class="mt-3">Tasks that are due soon</h2>
<section class="section row d-flex flex-column-row flex-md-row">
    {#if $project.id !== 0 && dueSoonTasks.length > 0}
        {#each dueSoonTasks as task}
            <InlineTask {task} mode='showRemainingDays' />
        {/each}
    {:else}
        <h5>No tasks to show</h5>
    {/if}
</section>

<h2 class="mt-3">Tasks that are assigned to you</h2>
<section class="section row d-flex flex-column-row flex-md-row">
    {#if $project.id !== 0 && currentUserTasks.length > 0}
        {#each currentUserTasks as task}
            <InlineTask {task} mode='show' />
        {/each}
    {:else}
        <h5>No tasks to show</h5>
    {/if}
</section>


<style>
    .chart-container {
        width: 50%;
    }

    @media only screen and (max-width: 767px) {
        .chart-container {
            width: 100%;
        }
    }
</style>