<script lang="ts">
	import { taskPriorities, taskSeverities, taskStatuses } from "./projectStore";
	import { project } from "./projectStore";
	import type { TaskData } from "../../../../../interfaces/TaskData";
    import Task from "../../tasks/Task.svelte";
	import { navigateTo } from "svelte-router-spa";

    let tasksByStatus: {
        [key: string]: TaskData[];
    } = {}
    $: if($taskStatuses && $taskStatuses.length > 0) {
        tasksByStatus = {};
        for(const status of $taskStatuses) tasksByStatus[status.code] = [];
        for(const task of $project.tasks) {
            tasksByStatus[task.status.code].push(task);
        }
    }
</script>

<div class="all-tasks-container w-100 mt-3 pb-5 d-flex gap-3">
    {#each $taskStatuses as taskStatus}
        <div class="task-list" id="task-{taskStatus.code}-list">
            <h3 class="task-header w-100 p-1 text-center" title={taskStatus.description}>{taskStatus.name}</h3>
            <ul class="list m-0 p-0 pb-5 d-flex flex-column align-items-stretch gap-2 list-unstyled">
                {#each tasksByStatus[taskStatus.code] as task}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li class="m-0" style="cursor: pointer;"
                    on:click={() => { navigateTo(`/tasks/${task.id}`) }}>
                        <Task {task} />
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
</div>

<style>
    .all-tasks-container {
        overflow-x: scroll;
    }

    .task-list {
        min-width: 20rem;
        max-width: 95vw;
        height: 100%;
    }

    .task-list > .list {
        /* box-shadow: var(--container-shadow); */
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