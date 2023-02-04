<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import { Navigate } from "svelte-router-spa";
	import parseDate from "../utilities/parseDate";

    export let task: TaskData;
    export let mode: 'showRemainingDays' | 'show';
    
    const getRemainingDays = () => {
        const now = new Date();
        const dueAt = new Date(task.dueAt);
        
        const delta = dueAt.getTime() - now.getTime();
        
        return Math.round(delta / 1000 / 3600 / 24);
    }

    const remainingDays = getRemainingDays();
</script>

<Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} styles="inline-task px-2 py-1 d-flex align-items-center gap-1 text-dark">
    <span class="category-circle rounded-circle" title={task.category.name}
    style="background-color: {task.category.color}"></span>

    <span class="title">{task.title}</span>

    {#if mode === 'showRemainingDays'}
        <span class="days-left-late ms-auto font-monospace">
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
    {/if}
</Navigate>

<style>
    .category-circle {
        min-height: 1rem; 
        height: 1rem; 
        min-width: 1rem; 
        width: 1rem; 
    }

    .title {
        display: block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .days-left-late {
        font-size: 0.85rem;
        min-width: fit-content;
    }
</style>