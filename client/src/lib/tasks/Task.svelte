<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import calculateTextColor from "../utilities/calculateTextColor";
	import parseDate from "../utilities/parseDate";
	import parseParagraphs from "../utilities/parseParagraphs";

    export let task: TaskData;
    export let componentClass = '';
    
    // const images = task.attachments.filter(attachment => attachment.isImage);
</script>

<div class="task-container w-100 bg-light {componentClass}">
    <div class="w-100 pt-3" style="background-color: {task.category.color}" title={task.category.name}></div>
    <header class="task-header w-100 p-2 pt-1">
        <h5 class="m-0">{task.title}</h5>
        <div class="small">{parseDate(task.createdAt)}</div>
    </header>
    <div class="px-2 py-1">
        <div class="d-flex gap-2">
            <div class="small">
                <span>Priority: </span>
                <span class="rounded-3 p-1" style="background: {task.priority.color}; color: {calculateTextColor(task.priority.color)}">{task.priority.name}</span>
            </div>
            <div class="small">
                <span>Severity: </span>
                <span class="rounded-3 p-1" style="background: {task.severity.color}; color: {calculateTextColor(task.severity.color)}">{task.priority.name}</span>
            </div>
        </div>
        {#if task.dueAt}
            <div class="small">
                <span>Due at: </span>
                <span>{parseDate(task.dueAt)}</span>
            </div>
        {/if}
        <div class="bug-description mt-1">
            {#each parseParagraphs(task.description, 200) as paragraph}
                <p class="small">{paragraph}</p>
            {/each}
        </div>
    </div>
</div>

<style>    
    .task-container {
        box-shadow: var(--container-shadow);
    }

    .attachments {
        font-size: 0.75rem;
    }
</style>