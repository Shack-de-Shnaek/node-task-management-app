<script lang="ts">
	import type { ProjectData } from "../../../../interfaces/ProjectData";
    import { project } from "../pages/projects/projectStore";
	import clickOutside from "../utilities/clickOutside";
	import handleResponse from "../utilities/handleResponse";
	import updateAllProjectCache from "../utilities/updateProjectCache";
    
    let expanded = false;

    let newPostData: {
        title: string,
        content: string,
        attachments: FileList
    } = {
        title: '',
        content: '',
        attachments: undefined
    }

    const post = async() => {
        if(newPostData.content === '') {
            alert('Posts must have a description');
            return;
        }
        
        let attachments = [];
    
        const read = async(i=0) => {
            if(i < newPostData.attachments.length) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    attachments.push(reader.result);
                    read(i+1);
                }
                reader.readAsDataURL(newPostData.attachments[i]);
            } else {
                try {
                    const res = await fetch(`/api/projects/${$project.id}/posts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: newPostData.title,
                            content: newPostData.content,
                            attachments: attachments
                        })
                    });
                    handleResponse<ProjectData>(res, (json) => {
                        updateAllProjectCache(json);
                        newPostData = {
                            title: '',
                            content: '',
                            attachments: undefined
                        }
                        expanded = false;
                    });
                } catch (e) {
                    alert('Could not create post');
                    console.log(e);
                }
            }
        }

        read();
    }
</script>

<div class="new-post-input-container">
    {#if expanded}
        <form id="new-post-form" class="p-2 d-flex flex-column align-items-center gap-2 bg-light"
        on:submit|preventDefault={() => post()} use:clickOutside on:click_outside={() => { expanded = false }}>
            <input type="text" required placeholder="Title" class="w-100"
            bind:value={newPostData.title}>
            
            <textarea rows="5" class="w-100" 
            bind:value={newPostData.content}></textarea>

            <input type="file" bind:files={newPostData.attachments} multiple={true}>

            <button type="submit" class="btn btn-success w-100 p-1">Post</button>
        </form>
    {:else}
        <button class="btn btn-success w-100" 
        on:click={() => { expanded = true }}>New Post</button>
    {/if}
</div>

<style>
    .new-post-input-container {
        width: 36rem;
        max-width: 100%;
    }

    #new-post-form {
        box-shadow: var(--container-shadow);
    }
</style>