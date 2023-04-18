<script lang="ts">
	import { taskStatuses } from "./projectStore";
	import { project } from "./projectStore";
	import type { TaskData } from "../../../../../interfaces/TaskData";
    import Task from "../../tasks/Task.svelte";
	import { Navigate, navigateTo } from "svelte-router-spa";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

    export let currentRoute;

    let tasksByStatus: {
        [key: string]: TaskData[];
    } = {}
    $: if($taskStatuses.length > 0 && $project.id !== 0) {
        tasksByStatus = {};
        for(const status of $taskStatuses) tasksByStatus[status.code] = [];
        for(const task of $project.tasks) {
            tasksByStatus[task.status.code].push(task);
        }
    }

    const bottomPadding: Writable<number> = getContext('layoutBottomPadding');
    $: if(currentRoute) bottomPadding.set(0.25);
</script>

<div class="w-100 h-100">
    <div class="task-toolbar p-1 d-flex algin-items-center gap-2">
        <Navigate to={`/projects/${$project.id}/new-task`} title="Add a new project" styles="btn btn-success p-1">
            <small>Add task</small>
        </Navigate>
        <Navigate to={`/calendar?project=${$project.id}`} title="Task calendar" styles="btn btn-primary p-1">
            <small>Task calendar</small>
        </Navigate>
    </div>
    <div class="all-tasks-container w-100 pb-5 d-flex gap-3">
        {#each $taskStatuses as taskStatus}
            <div class="task-list d-flex flex-column" id="task-{taskStatus.code}-list">
                <h3 class="task-header w-100 p-1 text-center" title={taskStatus.description}>{taskStatus.name}</h3>
                <ul class="list m-0 p-0 pb-5 d-flex flex-column align-items-stretch gap-2 list-unstyled">
                    {#each tasksByStatus[taskStatus.code] as task}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li class="m-0" style="cursor: pointer;"
                        on:click={() => { navigateTo(`/projects/${$project.id}/tasks/${task.id}`) }}>
                            <Task {task} />
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</div>

<style>
    .all-tasks-container {
        overflow-x: scroll;
        overflow-y: hidden;
        height: calc(100vh - 8rem);
    }

    .task-list {
        min-width: 20rem;
        max-width: 95vw;
        height: 100%;
    }

    .task-list .list {
        overflow-y: auto;
        max-height: calc(100% - 4rem);
    }

    @media only screen and (max-width: 577px) {
        .all-tasks-container {
            scroll-snap-type: x mandatory;
        }

        .all-tasks-container > div {
            scroll-snap-align: center;
        }
    }
</style>