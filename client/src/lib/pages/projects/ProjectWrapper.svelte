<script lang="ts">
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
    import { headerData } from "../../../store";
    import { taskPriorities, taskSeverities, taskStatuses } from "./projectStore"
    import { cachedProjects } from "../../../store";
    import { onDestroy, setContext } from "svelte";
    import { Route } from "svelte-router-spa";
    import { project } from "./projectStore";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import getTaskSeveritiesPrioritiesStatuses from "../../utilities/getTaskSeveritiesPrioritiesStatuses";
	import updateHeaderWithProjectData from "../../utilities/updateHeaderWithProjectData";

    export let currentRoute;
    export let params;

    const getProject = async(): Promise<ProjectData | null> => {
        try {
            const res = await fetch(`/api/projects/${currentRoute.namedParams.projectId}`);
            if(res.ok) {
                const projectData = await res.json();
                return projectData;
            } else {
                return null;
            }
        } catch (error) {
            alert('Could not fetch project data');
            console.log(error);
            // return null;
        }
    }

    $: if(currentRoute.namedParams.projectId !== undefined && parseInt(currentRoute.namedParams.projectId) !== $project.id) {
        if($cachedProjects[parseInt(currentRoute.namedParams.projectId)] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.projectId]);
            updateHeaderWithProjectData();
        }
        (async() => {
            let requestedOnRoute = currentRoute.path;
            const res: ProjectData = await getProject();
            if(res === null) {
                headerData.set({
                    title: "This project doesn't exist",
                    widgets: []
                });
                alert("This project doesn't exist");
                return;
            }
            updateAllProjectCache(res);
            if(requestedOnRoute === currentRoute.path) updateHeaderWithProjectData();

            if($taskSeverities.length === 0 || $taskPriorities.length === 0 || $taskStatuses.length === 0) {
                const data = await getTaskSeveritiesPrioritiesStatuses();
                taskSeverities.set(data.severities);
                taskPriorities.set(data.priorities);
                taskStatuses.set(data.statuses);
            }
        })();
    }

    $: if(parseInt(currentRoute.namedParams.taskId) === $project.id) updateHeaderWithProjectData();

    (async() => {
        await getProject();
    })();

    // onDestroy(() => {
    //     $project.id = 0;
    // });
</script>

<Route {currentRoute} {params} />
