<script lang="ts">
    import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
    import { headerData } from "../../../store";
    import { cachedProjects } from "../../../store";
    import { setContext } from "svelte";
    import { Route } from "svelte-router-spa";

    export let currentRoute;
    export let params;

    const project: Writable<ProjectData> = writable({
        id: 0,
        name: '',
        description: '',
        tasks: [],
        taskCategories: [],
        posts: [],
        createdAt: '',
        updatedAt: '',
        members: [],
        leader: {
            id: 0,
            email: '',
            firstName: '',
            lastName: ''
        }
    });

    setContext('project', project);

    const getProject = async(id: number): Promise<ProjectData | null> => {
        try {
            const res = await fetch(`/api/projects/${currentRoute.namedParams.id}`);
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
                    label: 'Home',
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
                {
                    label: 'Settings',
                    href: `/projects/${$project.id}/settings`,
                    color: '#3485FE'
                }
            ]
        })
    }

    $: if(parseInt(currentRoute.namedParams.id) !== $project.id) {
        if($cachedProjects[currentRoute.namedParams.id] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.id]);
            updateHeaderWithProjectData();
        }
        (async() => {
            const res: ProjectData = await getProject(currentRoute.namedParams.id);
            if(res === null) {
                headerData.set({
                    title: "This project doesn't exist",
                    widgets: []
                });
                alert("This project doesn't exist");
                return;
            }
            project.set(res);
            $cachedProjects[$project.id] = $project;
            updateHeaderWithProjectData();
        })()
    }
</script>

<Route {currentRoute} {params} />
