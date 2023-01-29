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
        description: '',
        thumbnail: undefined
    }
    
    const createProject = async () => {
        const reader = new FileReader();
        reader.readAsDataURL(newProjectData.thumbnail[0]);
        reader.onloadend = async () => {
            try {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newProjectData.name,
                        description: newProjectData.description.replaceAll('\n', '\\n'),
                        thumbnail: reader.result
                    })
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
    }
</script>

<form id="new-project-form" class="px-3 py-3 d-flex flex-column align-items-center gap-3 bg-light rounded-1"
on:submit={(event) => {event.preventDefault(); createProject()}}>
    <h2 class="w-100">Project information</h2>
    <input type="text" name="project-name" id="name-input" class="form-control" minlength="5" maxlength="100" 
    required placeholder="Project name"
    bind:value={newProjectData.name}>
    <textarea name="project-description" id="description-input" class="form-control" rows="5" minlength="5" 
    required placeholder="Project description"
    bind:value={newProjectData.description}></textarea>
    <input type="file" name="project-thumbnail" placeholder="Thumbnail" class="form-control"
    multiple={false} bind:files={newProjectData.thumbnail}>

    <button type="submit" class="btn btn-success p-1">Create</button>
</form>

<style>
    form {
        width: fit-content;
        max-width: 95vw;
        min-height: 25rem;
        margin: 0 auto;
        margin-top: 10%;
    }
    
    input, textarea {
        width: 32rem;
        max-width: 85vw;
    }

    button {
        width: fit-content;
        outline: none !important;
        border: none !important;
    }
</style>