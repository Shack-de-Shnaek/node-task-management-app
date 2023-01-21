<script lang="ts">
	import { cachedProjects } from "../../store";
	import type { NestError } from "../../../../interfaces/NestError";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import { project } from "../pages/projects/projectStore";
	import parseParagraphs from "../utilities/parseParagraphs";
	import updateAllProjectCache from "../utilities/updateProjectCache";
	import clickOutside from "../utilities/clickOutside";
	import handleResponse from "../utilities/handleResponse";

    export let value: string;
    export let textType: 'span' | 'paragraph' = 'span'
    export let module: string;
    export let objectId: number;
    export let field: string;
    export let allowEditing = false;

    let editMode = false;

    const save = async() => {
        editMode = false;
        try {
            const res = await fetch(`/api/${module}/${objectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: `{"${field}": "${value.replaceAll('\n', '\\n')}"}`
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
            });
        } catch (e) {
            console.log(e);
            alert('Could not save changes')
        }
    }
</script>

{#if textType === 'span'}
    {#if editMode}
        <form on:submit|preventDefault={() => save()} use:clickOutside on:click_outside={() => { editMode = false }}>
            <input type="text" class="w-100 form-control" bind:value={value}>
            <button type="submit" class="btn btn-success p-1 mt-2">Save</button>
        </form>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span on:click={() => {
            if(allowEditing) editMode = true
        }}>{value}</span>
    {/if}
{:else}
    {#if editMode}
        <form on:submit|preventDefault={() => save()} use:clickOutside on:click_outside={() => { editMode = false }}>
            <textarea rows="5" class="w-100 form-control" bind:value={value} />
            <button type="submit" class="btn btn-success p-1 mt-1">Save</button>
        </form>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if value}
            <div on:click={() => {
                if(allowEditing) editMode = true
            }}>
                {#each parseParagraphs(value) as paragraph}
                    <p class="mb-1">{paragraph}</p>
                {/each}
            </div>
        {/if}
    {/if}
{/if}

<style>
    button {
        font-size: 0.75rem;
    }
</style>