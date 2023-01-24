<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import handleResponse from "../utilities/handleResponse";
	import parseDate from "../utilities/parseDate";
	import parseParagraphs from "../utilities/parseParagraphs";
	import updateAllProjectCache from "../utilities/updateProjectCache";

    export let task: TaskData;
    export let componentClass = '';
    
    const images = task.attachments.filter(attachment => attachment.isImage);
</script>

<div class="task-container bg-light {componentClass}">
    <div class="w-100 pt-3" style="background-color: {task.category.color}" title={task.category.name}></div>
    <header class="task-header w-100 p-2 pt-1">
        <h5 class="m-0">{task.title}</h5>
        <div class="small">{parseDate(task.createdAt)}</div>
    </header>
    <div class="px-2 py-1">
        {#each parseParagraphs(task.description) as paragraph}
            <p class="small">{paragraph}</p>
        {/each}
    </div>
    {#if images.length > 0}
        <div class="carousel slide" id="task-{task.id}-carousel" data-bs-ride="carousel" data-bs-interval="false">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src={images[0].path} alt="" class="w-100">
                </div>
                {#each images.slice(1) as image}
                    <div class="carousel-item">
                        <img src={image.path} alt="" class="w-100">
                    </div>
                {/each}
            </div>
            {#if images.length > 1}
                <button class="carousel-control-prev" type="button" data-bs-target="#task-{task.id}-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#task-{task.id}-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>    
    .task-container {
        width: 100%;
        box-shadow: var(--container-shadow);
    }

    .attachments {
        font-size: 0.75rem;
    }
</style>