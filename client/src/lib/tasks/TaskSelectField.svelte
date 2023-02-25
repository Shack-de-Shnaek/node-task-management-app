<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import { currentUserIsAdmin } from "../pages/projects/projectStore";
	import handleResponse from "../utilities/handleResponse";
	import updateAllTaskstCache from "../utilities/updateTaskCache";
	import updateTaskInProjectCache from "../utilities/updateTaskInProjectCache";

    const task: Writable<TaskData> = getContext('task');
    export let options: any[];
    export let field: 'severityCode' | 'priorityCode' | 'statusCode' | 'categoryId' | 'assignedToId';

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

    const updateTask = async(newValue) => {
        if(!isNaN(parseInt(newValue))) newValue = parseInt(newValue);
        await handleResponse<TaskData>(
            `/api/tasks/${$task.id}`,
            {
                method: 'PUT',
                body: { [field]: newValue },
                errorMessage: 'Could not update project'
            },
            (json) => {
                task.set(json);
                updateTaskInProjectCache(json);
                updateAllTaskstCache(json);
            },
        )
    }
</script>

<select class="form-select p-1" name={field} 
disabled={!$currentUserIsAdmin && field === 'assignedToId'} {value}
on:change={(event) => updateTask(event.target.value)}>
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