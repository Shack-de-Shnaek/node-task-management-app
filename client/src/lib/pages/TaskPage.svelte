<script lang="ts">
	import { cachedProjects, headerData } from "../../store";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import type { TaskAttachmentData, TaskData } from "../../../../interfaces/TaskData";
	import { project } from "./projects/projectStore";
	import type { NestError } from "../../../../interfaces/NestError";
	import { writable, type Writable } from "svelte/store";

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

    const getTask = async() => {
        if(!currentRoute.namedParams.id || isNaN(parseInt(currentRoute.namedParams.id))) {
            alert('Invalid task ID');
        }
        
        const fetchedTaskData: TaskData = $project.tasks.find(t => t.id === parseInt(currentRoute.namedParams.id));
        if(fetchedTaskData !== undefined) task.set(fetchedTaskData);
        
        for(const key in $cachedProjects) {
            const cachedTask = $cachedProjects[key].tasks.find(t => t.id === parseInt(currentRoute.namedParams.id));
            if(cachedTask !== undefined) {
                task.set(cachedTask)
                return;
            }
        }
        
        try {
            const res = await fetch(`/api/tasks/${currentRoute.namedParams.id}`);
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

    $: if($task.id !== parseInt(currentRoute.namedParams.id)) {
        console.log('b')
        getTask();   
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
    }
</script>

{currentRoute.namedParams.id}

<div class="task-container w-100 bg-light row">
    <div class="col-12 col-sm">

    </div>
</div>

<style>
    .task-container {
        box-shadow: var(--container-shadow);
    }
</style>