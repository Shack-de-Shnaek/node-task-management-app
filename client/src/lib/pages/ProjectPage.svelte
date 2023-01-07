<script lang="ts">
    import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
    import { headerData } from "../../store";
    import { cachedProjects } from "../../store";

    export let currentRoute;

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

    const getProject = async(id: number): Promise<ProjectData | null> => {
        try {
            const res = await fetch(`/api/projects/${currentRoute.namedParams.id}`);
            if(res.status < 400) {
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
    
    $: if(parseInt(currentRoute.namedParams.id) !== $project.id) {
        if($cachedProjects[currentRoute.namedParams.id] !== undefined) {
            project.set($cachedProjects[currentRoute.namedParams.id]);
            headerData.set({
                title: $project.name,
                widgets: []
            });
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
            headerData.set({
                title: $project.name,
                widgets: []
            });
        })()
    }
</script>

<h1>{$project.name}</h1>