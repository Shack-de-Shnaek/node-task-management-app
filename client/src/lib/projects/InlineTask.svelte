<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import { navigateTo } from "svelte-router-spa";
	import parseDate from "../utilities/parseDate";

    export let task: TaskData;
    
    const getRemainingDays = () => {
        const now = new Date();
        const dueAt = new Date(task.dueAt);
        
        const delta = dueAt.getTime() - now.getTime();
        
        return Math.round(delta / 1000 / 3600 / 24);
    }

    const remainingDays = getRemainingDays();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="inline-task px-2 py-1 d-flex align-items-center gap-1" style="cursor: pointer;"
on:click={() => { navigateTo(`/projects/${task.project.id}/tasks/${task.id}`) }}>
    <span class="category-circle rounded-circle" title={task.category.name}
    style="background-color: {task.category.color}"></span>

    <span class="title">{task.title}</span>

    <span class="ms-auto font-monospace">
        <!-- <span class="small">{parseDate(task.dueAt)}</span> -->
        <span>
            {#if remainingDays > 0}
                <span>{remainingDays} days</span>
                <span> left</span>
            {:else}
                <span>{Math.abs(remainingDays)} days</span>
                <span class="text-danger"> late</span>
            {/if}
        </span>
    </span>
</div>

<style>
    .category-circle {
        height: 1rem; 
        width: 1rem; 
    }

    .title {
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>