<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import handleResponse from "../utilities/handleResponse";
	import updateTaskInProjectCache from "../utilities/updateTaskInProjectCache";

    const task: Writable<TaskData> = getContext('task');
    export let options: any[];
    export let field: 'severityCode' | 'priorityCode' | 'statusCode' | 'categoryId' | 'assignedToId';
    const currentUserIsAdmin: Writable<boolean> = getContext('currentUserIsAdmin');

    let value: number | string;
    $: if(options && $task.id !== 0) {
        switch (field) {
            case 'severityCode':
                value = $task.severity.code;
                break;
            case 'priorityCode':
                value = $task.priority.code;
                break;
            case 'statusCode':
                value = $task.status.code;
                break;
            case 'categoryId':
                value = $task.category.id;
                break;
            case 'assignedToId':
                value = $task.assignedTo!==null?$task.assignedTo.id:null;
                break;
        }
    }

    const updateTask = async() => {
        try {
            const res = await fetch(`/api/tasks/${$task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value })
            });
            await handleResponse<TaskData>(res, (json) => {
                task.set(json);
                updateTaskInProjectCache(json);
                // backgroundColor.set(getBackgroundColor());
            });
        } catch (e) {
            alert('Could not update project');
            console.log(e);
        }
    }
    
    // const getBackgroundColor = () => {
    //     if(options.length > 0 && Object.hasOwn(options[0], 'color')) {
    //         const filteredOptions = options.filter(option => value === option.code);
    //         if(filteredOptions.length > 0) return `background: ${filteredOptions[0].color}`;
    //     }
    //     return '';
    // }
    // const backgroundColor: Writable<string> = writable(getBackgroundColor());
</script>

<select class="form-select" name={field} 
disabled={!$currentUserIsAdmin && field === 'assignedToId'} bind:value={value} 
on:change={() => updateTask()}>
    {#each options as option}
        <option value={!Object.hasOwn(option, 'code')?option.id:option.code}>
            {#if Object.hasOwn(option, 'name')}
                <span>{option.name}</span>
            {:else}
                <span>{option.firstName} {option.lastName}</span>
            {/if}
            {#if Object.hasOwn(option, 'color')}
                <span class="ms-1 rounded-circle" style="width: 1rem; height: 1rem; background: {option.color}"></span>
            {/if}
        </option>
    {/each}
</select>