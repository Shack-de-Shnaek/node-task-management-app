<script lang="ts">
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import parseParagraphs from "../utilities/parseParagraphs";
	import updateAllProjectCache from "../utilities/updateProjectCache";
	import clickOutside from "../utilities/clickOutside";
	import handleResponse from "../utilities/handleResponse";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import updateTaskInProjectCache from "../utilities/updateTaskInProjectCache";
	import type { UserData } from "../../../../interfaces/UserData";
	import { currentUserData } from "../../store";

    export let value: string;
    export let textType: 'span' | 'paragraph' = 'span'
    export let module: string;
    export let objectId: number;
    export let field: string;
    export let allowEditing = false;
    export let useId = true;

    let editMode = false;

    let paragraphContainerHeight: number;
    const editTextArea = (event: MouseEvent) => {
        if(!allowEditing) return;
        editMode = true;
    }

    const save = async() => {
        editMode = false;
        let callback: <T>(json: T) => void = undefined;
        switch(module) {
            case 'projects':
                callback = <ProjectData>(json) => updateAllProjectCache(json);
                break;
            case 'tasks':
                callback = <TaskData>(json) => updateTaskInProjectCache(json);
                break;
            case 'users':
                callback = <UserData>(json) => currentUserData.set(json);
                break;
            default: 
                callback = (json) => {}
        }
        handleResponse<ProjectData>(
            `/api/${module}${useId ? '/' + objectId : ''}`,
            {
                method: 'PUT',
                body: { [field]: value.replaceAll('\n', '\\n')},
                errorMessage: 'Could not save changes'
            },
            callback,
        );
    }
</script>

{#if textType === 'span'}
    {#if editMode}
        <form on:submit|preventDefault={() => save()} use:clickOutside on:click_outside={() => { editMode = false }}>
            <input type="text" class="w-100 form-control" min="5"
            bind:value={value}>
            <button type="submit" class="btn btn-success p-1 mt-2">Save</button>
        </form>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span on:click={() => {
            if(allowEditing) editMode = true
        }}>{value ? value : `No ${field}`}</span>
    {/if}
{:else}
    {#if editMode}
        <form on:submit|preventDefault={() => save()} use:clickOutside on:click_outside={() => { editMode = false }}>
            <textarea rows={paragraphContainerHeight/21} class="w-100 form-control" minlength="5"
            bind:value={value}  />
            <button type="submit" class="btn btn-success p-1 mt-1">Save</button>
        </form>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if value}
            <div on:click={editTextArea} bind:offsetHeight={paragraphContainerHeight}>
                {#each parseParagraphs(value) as paragraph}
                    <p class="mb-1">{paragraph}</p>
                {/each}
            </div>
        {:else}
            <span on:click={editTextArea}>No {field}</span>
        {/if}
    {/if}
{/if}

<style>
    button {
        font-size: 0.75rem;
    }
</style>