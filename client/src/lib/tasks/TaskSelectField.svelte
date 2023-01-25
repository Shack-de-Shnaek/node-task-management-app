<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { TaskData } from "../../../../interfaces/TaskData";
	import handleResponse from "../utilities/handleResponse";
	import updateTaskInProjectCache from "../utilities/updateTaskInProjectCache";

    const task: Writable<TaskData> = getContext('task');
    export let options: any[];
    export let field: 'severityCode' | 'priorityCode' | 'categoryId';
    
    let value: number | string;
    $: if(options) {
        switch (field) {
        case 'severityCode':
            value = $task.severity.code;
            break;
        case 'priorityCode':
            value = $task.priority.code;
            break;
        case 'categoryId':
            value = $task.category.id;
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
            });
        } catch (e) {
            alert('Could not update project');
            console.log(e);
        }
    }
</script>

<select class="form-select" name={field} bind:value={value} on:change={() => updateTask()}>
    {#each options as option}
        <option value={field==='categoryId'?option.id:option.code}>{option.name}</option>
    {/each}
</select>