<script lang="ts">
	import { cachedProjects, headerData } from "../../../store";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import type { TaskAttachmentData, TaskData } from "../../../../../interfaces/TaskData";
	import { project, taskPriorities, taskSeverities } from "./projectStore";
	import type { NestError } from "../../../../../interfaces/NestError";
	import { writable, type Writable } from "svelte/store";
	import { setContext } from "svelte";
	import TaskSelectField from "../../tasks/TaskSelectField.svelte";

    export let currentRoute: CurrentRoute;
    let task: Writable<TaskData> = writable({
        id: 0,
        title: undefined,
        description: undefined,
        category: undefined,
        severity: undefined,
        priority: undefined,
        status: undefined,
        project: undefined,
        createdBy: undefined,
        createdAt: undefined,
        assignedTo: undefined,
        assignedAt: undefined,
        attachments: undefined,
        comments: undefined,
    });

    setContext('task', task);

    const getTask = async() => {
        if(!currentRoute.namedParams.taskId || isNaN(parseInt(currentRoute.namedParams.taskId))) {
            alert('Invalid task ID');
        }
        
        const fetchedTaskData: TaskData = $project.tasks.find(t => t.id === parseInt(currentRoute.namedParams.taskId));
        if(fetchedTaskData !== undefined) task.set(fetchedTaskData);
        
        for(const key in $cachedProjects) {
            const cachedTask = $cachedProjects[key].tasks.find(t => t.id === parseInt(currentRoute.namedParams.taskId));
            if(cachedTask !== undefined) {
                task.set(cachedTask)
                return;
            }
        }
        
        try {
            const res = await fetch(`/api/tasks/${currentRoute.namedParams.taskId}`);
            if(res.ok) {
                const json = await res.json();
                task.set(json);
            } else {
                const json: NestError = await res.json();
                alert(json.message)
            }
        } catch (e) {
            alert('Could not fetch task data');
            console.log(e);
        }
    }

    let images: TaskAttachmentData[] = [];
    $: if($task.id !== parseInt(currentRoute.namedParams.taskId)) {
        (async() => {
            await getTask();
            images = $task.attachments.filter(attachment => attachment.isImage);
            if($task.id !== 0) {
                headerData.set({
                    title: $task.title,
                    widgets: [
                        {
                            label: 'Project',
                            href: `/projects/${$task.project.id}`,
                            color: '#3485FE'
                        },
                        {
                            label: 'All Tasks',
                            href: `/projects/${$task.project.id}/tasks`,
                            color: '#fd7e14'
                        }
                    ]
                });
            }
        })();
    }
</script>

<div class="task-container w-100 mt-3 p-2 bg-light">
    <div class="row gap-1 gap-sm-0 flex-column flex-sm-row">
        <div class="task-selector col-4 d-flex flex-row flex-sm-column flex-md-row align-items-center gap-1">
            <span>Severity</span>
            {#if $taskSeverities.length > 0}
                <TaskSelectField field='severityCode' options={$taskSeverities} />
            {/if}
        </div>
        <div class="task-selector col-4 d-flex flex-row flex-sm-column flex-md-row align-items-center gap-1">
            <span>Priority</span>
            {#if $taskPriorities.length > 0}
                <TaskSelectField field='priorityCode' options={$taskPriorities} />
            {/if}
        </div>
        <div class="task-selector col-4 d-flex flex-row flex-sm-column flex-md-row align-items-center gap-1">
            <span>Category</span>
            {#if $project.id !== 0}
                <TaskSelectField field='categoryId' options={$project.taskCategories} />
            {/if}
        </div>
    </div>
</div>

<style>
    .task-container {
        box-shadow: var(--container-shadow);
    }

    .task-selector {
        min-width: 12rem;
    }

    @media only screen and (max-width: 577px) {
        .task-selector {
            width: 100%;       
        }
    }
</style>