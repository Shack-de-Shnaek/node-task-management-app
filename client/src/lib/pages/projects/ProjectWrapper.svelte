<script lang="ts">
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
    import { taskPriorities, taskSeverities, taskStatuses } from "./projectStore"
    import { cachedProjects } from "../../../store";
    import { Route } from "svelte-router-spa";
    import { project } from "./projectStore";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import getTaskSeveritiesPrioritiesStatuses from "../../utilities/getTaskSeveritiesPrioritiesStatuses";
	import updateHeaderWithProjectData from "../../utilities/updateHeaderWithProjectData";
	import handleResponse from "../../utilities/handleResponse";
	import { onMount } from "svelte";

    export let currentRoute;
    export let params;

    const getProject = async () => {
        if($cachedProjects[parseInt(currentRoute.namedParams.projectId)] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.projectId]);
            updateHeaderWithProjectData();
        }
        
        try {
            const res = await fetch(`/api/projects/${currentRoute.namedParams.projectId}`);
            handleResponse<ProjectData>(res, async (json) => {
                project.set(json);
                updateAllProjectCache(json);
                updateHeaderWithProjectData();

                if($taskSeverities.length === 0 || $taskPriorities.length === 0 || $taskStatuses.length === 0) {
                    const data = await getTaskSeveritiesPrioritiesStatuses();
                    taskSeverities.set(data.severities);
                    taskPriorities.set(data.priorities);
                    taskStatuses.set(data.statuses);
                }
            });
        } catch (e) {
            alert('Could not fetch project data');
            console.log(e);
        }
    }

    $: if(currentRoute.namedParams.projectId !== undefined && parseInt(currentRoute.namedParams.projectId) !== $project.id) {
        getProject();
    }

    $: if(currentRoute.namedParams.projectId !== undefined && currentRoute.namedParams.taskId === undefined) {
        updateHeaderWithProjectData();
    }

    onMount(async () => {
        await getProject();
    });
</script>

<Route {currentRoute} {params} />
