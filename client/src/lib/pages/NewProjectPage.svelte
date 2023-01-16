<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import { cachedProjects, currentUserData, headerData } from "../../store";
	import handleResponse from "../utilities/handleResponse";

    headerData.set({
        title: 'New project',
        widgets: []
    });

    const newProjectData = {
        name: '',
        description: ''
    }
    
    const createProject = async () => {
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProjectData)
            });
            handleResponse<ProjectData>(res, (json) => {
                cachedProjects.update(cache => {
                    cache[json.id] = json;
                    return cache;
                });
                currentUserData.update(user => {
                    user.projects.push(json);
                    user.leaderOfProjects.push(json);
                    return user;
                });
                navigateTo(`/projects/${json.id}`);
                return;
            });
        } catch (e) {
            console.log(e);
            alert('Could not create the project');
        }
    }
</script>

<form id="new-project-form" class="px-3 py-3 d-flex flex-column align-items-center gap-4 bg-light rounded-1"
on:submit={(event) => {event.preventDefault(); createProject()}}>
    <h2 class="w-100">Project information</h2>
    <input type="text" name="project-name" id="name-input" minlength="5" maxlength="100" 
    required placeholder="Project name"
    bind:value={newProjectData.name}>
    <input type="text" name="project-description" id="description-input" minlength="5" 
    required placeholder="Project description"
    bind:value={newProjectData.description}>

    <button type="submit" class="btn btn-primary">Create</button>
</form>

<style>
    form {
        width: fit-content;
        max-width: 95vw;
        height: 25rem;
        margin: 0 auto;
        margin-top: 20%;
    }
    
    input {
        width: 24rem;
        max-width: 85vw;
        background-color: inherit;
        outline: none;
        border: none;
        border-bottom: 2px solid var(--dark-gray);
        transition: 0.2s;
    }

    button {
        width: fit-content;
        outline: none !important;
        border: none !important;
    }

    input:focus, input:hover {
        border-bottom-color: var(--bs-primary);
    }
</style>