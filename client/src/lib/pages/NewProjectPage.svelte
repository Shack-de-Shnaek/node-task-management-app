<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import { cachedProjects, currentUserData, headerData } from "../../store";

    headerData.set({
        title: 'New project',
        widgets: []
    });

    const newProjectData = {
        name: '',
        description: ''
    }
    
    const createProject = async () => {
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProjectData)
        });
        if(res.ok) {
            const newProject: ProjectData = await res.json();
            cachedProjects.update(cache => {
                cache[newProject.id] = newProject;
                return cache;
            });
            currentUserData.update(user => {
                user.projects.push(newProject);
                user.leaderOfProjects.push(newProject);
                return user;
            });
            navigateTo(`/projects/${newProject.id}`);
            return;
        }
        alert('Could not create the project');
    }
</script>

<form id="new-project-form" on:submit={(event) => {event.preventDefault(); createProject()}}>
    <input type="text" name="project-name" id="name-input" minlength="5" maxlength="100" required 
    bind:value={newProjectData.name}>
    <input type="text" name="project-description" id="description-input" minlength="5" required 
    bind:value={newProjectData.description}>

    <button type="submit">Create</button>
</form>