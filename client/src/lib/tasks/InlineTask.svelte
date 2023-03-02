<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import { Navigate } from "svelte-router-spa";
	import taskTitleText from "../utilities/taskTitleText";

    export let task: TaskData;
    export let mode: 'showRemainingDays' | 'show';
    export let isInProjectPage = true;
    
    const getRemainingDays = () => {
        if(!task.dueAt || ['fixed', 'rejected'].includes(task.status.code)) return null;
        
        const now = new Date();
        const dueAt = new Date(task.dueAt);
        
        const delta = dueAt.getTime() - now.getTime();
        
        const deltaDays = Math.round(delta / 1000 / 3600 / 24);
        
        return deltaDays;
    }
    
    const remainingDays = getRemainingDays();
</script>

<Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} styles=""  title={taskTitleText(task)}>
    <div class="inline-task p-2 d-flex align-items-center gap-1 text-dark">
        {#if isInProjectPage}
            <span class="category-circle rounded-circle" title={task.category.name}
            style="background-color: {task.category.color}"></span>
        {/if}
    
        <span class="title">{task.title}</span>
    
        {#if !isInProjectPage}
            <span class="project-name"> - {task.project.name}</span>
        {/if}

        {#if mode === 'showRemainingDays'}
            <span class="days-left-late ms-auto font-monospace">
                <span>
                    {#if remainingDays >= 0}
                        <span>{remainingDays} days</span>
                        <span> left</span>
                    {:else if remainingDays < 0}
                        <span>{Math.abs(remainingDays)} days</span>
                        <span class="text-danger"> late</span>
                    {/if}
                </span>
            </span>
        {/if}
    </div>
</Navigate>

<style>
    .inline-task {
        transition: 0.5s;
    }
    
    .inline-task:hover {
        background-color: var(--bs-white);
    }
    
    .category-circle {
        min-height: 1rem; 
        height: 1rem; 
        min-width: 1rem; 
        width: 1rem; 
    }

    .title, .project-name {
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