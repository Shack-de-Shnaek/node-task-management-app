<script lang="ts">
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
    import { cachedProjects } from "../../../store";
    import { Route } from "svelte-router-spa";
    import { project } from "./projectStore";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import updateHeaderWithProjectData from "../../utilities/updateHeaderWithProjectData";
	import handleResponse from "../../utilities/handleResponse";

    export let currentRoute;
    export let params;

    const getProject = async () => {
        if($cachedProjects[parseInt(currentRoute.namedParams.projectId)] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.projectId]);
            updateHeaderWithProjectData();
        }
        
        await handleResponse<ProjectData>(
            `/api/projects/${currentRoute.namedParams.projectId}`,
            { errorMessage: 'Could not fetch project data' },
            (json) => {
                project.set(json);
                updateAllProjectCache(json);
                updateHeaderWithProjectData();
            }
        );
    }

    $: if(currentRoute.namedParams.projectId !== undefined && $project && parseInt(currentRoute.namedParams.projectId) !== $project.id) {
        getProject();
    }

    $: if($project && $project.id !== 0 && currentRoute.path.includes('projects') && currentRoute?.childRoute.namedParams.taskId === undefined) {
        updateHeaderWithProjectData();
    }
</script>

<Route {currentRoute} {params} />
