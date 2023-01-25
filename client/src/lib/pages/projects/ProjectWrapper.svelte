<script lang="ts">
    import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
    import { currentUserData, headerData } from "../../../store";
    import { taskPriorities, taskSeverities, taskStatuses } from "./projectStore"
    import { cachedProjects } from "../../../store";
    import { onDestroy, setContext } from "svelte";
    import { navigateTo, Route } from "svelte-router-spa";
    import { project } from "./projectStore";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import getTaskSeveritiesPrioritiesStatuses from "../../utilities/getTaskSeveritiesPrioritiesStatuses";

    export let currentRoute;
    export let params;

    const currentUserIsLeader: Writable<boolean> = writable();
    const currentUserIsAdmin: Writable<boolean> = writable();
    const currentUserIsMember: Writable<boolean> = writable();

    setContext('currentUserIsLeader', currentUserIsLeader);
    setContext('currentUserIsAdmin', currentUserIsAdmin);
    setContext('currentUserIsMember', currentUserIsMember);

    const getProject = async(id: number): Promise<ProjectData | null> => {
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
    
    const updateHeaderWithProjectData = () => {
        headerData.set({
            title: $project.name,
            widgets: [
                {
                    label: 'Dashboard',
                    href: `/projects/${$project.id}`,
                    color: '#3485FE'
                },    
                {
                    label: 'Posts',
                    value: $project.posts.length,
                    href: `/projects/${$project.id}/posts`,
                    color: '#20c997'
                },
                {
                    label: 'Tasks',
                    value: $project.tasks.length,
                    href: `/projects/${$project.id}/tasks`,
                    color: '#fd7e14'
                },
                {
                    label: 'About',
                    href: `/projects/${$project.id}/about`,
                    color: '#0dcaf0'
                },
            ]
        });
    }

    $: if(parseInt(currentRoute.namedParams.projectId) !== $project.id) {
        if($cachedProjects[currentRoute.namedParams.projectId] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.projectId]);
            updateHeaderWithProjectData();
        }
        (async() => {
            const res: ProjectData = await getProject(currentRoute.namedParams.projectId);
            if(res === null) {
                headerData.set({
                    title: "This project doesn't exist",
                    widgets: []
                });
                alert("This project doesn't exist");
                return;
            }
            updateAllProjectCache(res);
            updateHeaderWithProjectData();
        })();
    }

    $: if($project) {
        currentUserIsLeader.set($project.leader.id === $currentUserData.id);
        currentUserIsAdmin.set($project.admins.flatMap(admin => admin.id).includes($currentUserData.id));
        currentUserIsMember.set($project.members.flatMap(member => member.id).includes($currentUserData.id));
        if($project.tasks) {
            (async() => {
                if($taskSeverities.length === 0 || $taskPriorities.length === 0 || $taskStatuses.length === 0) {
                    const data = await getTaskSeveritiesPrioritiesStatuses();
                    taskSeverities.set(data.severities);
                    taskPriorities.set(data.priorities);
                    taskStatuses.set(data.statuses);
                }
            })();
        }
    }

    onDestroy(() => {
        $project.id = 0;
    });
</script>

<Route {currentRoute} {params} />
