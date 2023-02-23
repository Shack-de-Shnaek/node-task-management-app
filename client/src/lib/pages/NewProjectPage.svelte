<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import { cachedProjects, currentUserData, headerData } from "../../store";
	import handleResponse from "../utilities/handleResponse";
	import updateAllProjectCache from "../utilities/updateProjectCache";
	import uploadMultipleAttachments from "../utilities/uploadMultipleAttachments";

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
        if(newProjectData.name.length < 5) {
            alert('Projects must have a name 5 characters long or longer');
            return;
        }

        if(newProjectData.description.length < 5) {
            alert('Projects must have a description 5 characters long or longer')
            return;
        }

        const otherData = {...newProjectData};
        delete otherData.thumbnail;
        await uploadMultipleAttachments<ProjectData>(
            '/api/projects',
            'POST',
            newProjectData.thumbnail,
            (data) => {
                updateAllProjectCache(data);
                navigateTo(`/projects/${data.id}`);
            },
            otherData,
            'thumbnail',
        )
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