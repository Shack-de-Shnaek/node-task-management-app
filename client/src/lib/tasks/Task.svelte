<script lang="ts">
	import type { TaskData } from "../../../../interfaces/TaskData";
	import calculateTextColor from "../utilities/calculateTextColor";
	import parseDate from "../utilities/parseDate";
	import parseParagraphs from "../utilities/parseParagraphs";
	import taskTitleText from "../utilities/taskTitleText";

    export let task: TaskData;
    export let componentClass = '';
    export let isInProjectPage = true;

    // const images = task.attachments.filter(attachment => attachment.isImage);
</script>

<div class="task-container w-100 bg-light {componentClass}" title={taskTitleText(task)}>
    <div class="w-100 pt-3" style="background-color: {task.category.color}" title={task.category.name}></div>
    <header class="task-header w-100 p-2 pt-1">
        <h5 class="m-0">{task.title}</h5>
        <div class="small font-monospace">{parseDate(task.createdAt)}</div>
    </header>
    <div class="px-2 py-1">
        <div class="d-flex gap-2">
            <div class="small">
                <span>Severity: </span>
                <span class="rounded-3 p-1" style="background: {task.severity.color}; color: {calculateTextColor(task.severity.color)}" title={task.severity.description}>{task.severity.name}</span>
            </div>
            <div class="small">
                <span>Priority: </span>
                <span class="rounded-3 p-1" style="background: {task.priority.color}; color: {calculateTextColor(task.priority.color)}" title={task.priority.description}>{task.priority.name}</span>
            </div>
        </div>
        {#if task.assignedTo}
            <div class="small d-flex flex-column">
                {#if !isInProjectPage}
                    <div>
                        <span>Project: </span>
                        <a href={`/project/${task.project.id}`}>
                            <img src={task.project.thumbnailPath?task.project.thumbnailPath:'/icons/project.webp'} alt="" class="rounded-circle" style="height: 1rem; width: 1rem;">
                            <span>{task.project.name}</span>
                        </a>
                    </div>
                {/if}
                <div>
                    <span>Assigned To: </span>
                    <a href={`/users/${task.assignedTo.id}`}>
                        <img src={task.assignedTo.thumbnailPath?task.assignedTo.thumbnailPath:'/icons/user.webp'} alt="" class="rounded-circle" style="height: 1rem; width: 1rem;">
                        <span>{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                    </a>
                </div>
            </div>
        {/if}
        {#if task.dueAt}
            <div class="small">
                <span>Due At: </span>
                <span class="font-monospace">{parseDate(task.dueAt)}</span>
            </div>
        {/if}
        <div class="bug-description mt-1">
            {#each parseParagraphs(task.description, 200) as paragraph}
                <p class="small mb-1">{paragraph}</p>
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