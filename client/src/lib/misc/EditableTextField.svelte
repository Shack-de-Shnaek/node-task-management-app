<script lang="ts">
	import { cachedProjects } from "../../store";
	import type { NestError } from "../../../../interfaces/NestError";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
	import { project } from "../pages/projects/projectStore";
	import parseParagraphs from "../utilities/parseParagraphs";

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
            if(res.ok) {
                const json: ProjectData = await res.json();
                project.set(json);
                cachedProjects.update(cache => {
                    cache[json.id] = json;
                    return cache
                });
            } else {
                const json: NestError = await res.json()
                if(json.message) alert(json.message);
                else alert('Could not save changes')
            }
        } catch (e) {
            console.log(e);
            alert('Could not save changes')
        }
    }
</script>

{#if textType === 'span'}
    {#if editMode}
        <form on:submit|preventDefault={() => save()}>
            <input type="text" class="w-100" bind:value={value}>
            <button type="submit" class="btn btn-success p-1">Save</button>
        </form>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span on:click={() => {
            if(allowEditing) editMode = true
        }}>{value}</span>
    {/if}
{:else}
    {#if editMode}
        <form on:submit|preventDefault={() => save()}>
            <textarea rows="5" class="w-100" bind:value={value} />
            <button type="submit" class="btn btn-success p-1">Save</button>
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