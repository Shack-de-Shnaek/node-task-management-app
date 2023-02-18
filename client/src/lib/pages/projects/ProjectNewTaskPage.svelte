<script lang="ts">
	import parseFileSize from "../../utilities/parseFileSize";
	import { taskPriorities, taskSeverities } from "./projectStore";
    import { project, currentUserIsAdmin } from "./projectStore";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
	import uploadMultipleAttachments from "../../utilities/uploadMultipleAttachments";

    const newTaskData: {
        title: string;
        description: string;
        severityCode: string;
        priorityCode: string;
        assignedToId?: number;
        categoryId: number;
        dueAt?: string;
        attachments: FileList
    } = {
        title: '',
        description: '',
        severityCode: undefined,
        priorityCode: undefined,
        assignedToId: undefined,
        categoryId: undefined,
        dueAt: undefined,
        attachments: undefined
    }

    const post = async() => {
        if(newTaskData.title.length < 5) {
            alert('Tasks must have a title 5 characters long or longer');
            return;
        }
           
        if(newTaskData.title.length < 5) {
            alert('Tasks must have a description 5 characters long or longer');
            return;
        }

        if(!newTaskData.severityCode) {
            alert('Tasks must have a severity');
            return;
        }

        if(!newTaskData.priorityCode) {
            alert('Tasks must have a priority');
            return;
        }

        if(!newTaskData.categoryId) {
            alert('Tasks must have a category');
            return;
        }

        const otherData = {...newTaskData};
        delete otherData.attachments;
        await uploadMultipleAttachments<ProjectData>(
            `/api/projects/${$project.id}/tasks`,
            'POST',
            newTaskData.attachments,
            (data) => {
                updateAllProjectCache(data);
                navigateTo(`/projects/${data.id}/tasks`)
            },
            otherData
        );
    }
</script>

<div class="new-task-container container-fluid mt-3 p-3 bg-light">
    <form class="w-100 d-flex flex-column gap-3 align-items-start"
    on:submit|preventDefault={() => post()}>
        <input type="text" name="task-title" id="task-title" placeholder="Title" class="form-control"
        required minlength="5" bind:value={newTaskData.title}>
        
        <textarea name="task-description" id="task-description" rows="5" placeholder="Description" class="w-100 form-control"
        required minlength="5" bind:value={newTaskData.description}></textarea>
        
        <fieldset>
            <label for="task-severity">Severity</label>
            <select name="task-severity" id="task-severity" class="form-select"
            required bind:value={newTaskData.severityCode}>
                {#each $taskSeverities as severity, i}
                    <option value={severity.code} title={severity.description}>{severity.name}</option>
                {/each}
            </select>
        </fieldset>

        <fieldset>
            <label for="task-priority">Priority</label>
            <select name="task-priority" id="task-priority" class="form-select"
            required bind:value={newTaskData.priorityCode}>
                {#each $taskPriorities as priority}
                    <option value={priority.code} title={priority.description}>{priority.name}</option>
                {/each}
            </select>
        </fieldset>
        
        <fieldset disabled={!$currentUserIsAdmin}>
            <label for="task-assigned-to">Assign To</label>
            <select name="task-assigned-to" id="task-assigned-to" class="form-select"
            bind:value={newTaskData.assignedToId}>
                <option value={null}>Nobody</option>
                {#each $project.members as member}
                    <option value={member.id}>{member.firstName} {member.lastName}</option>
                {/each}
            </select>
        </fieldset>
        
        <fieldset>
            <label for="task-category">Category</label>
            <select name="task-category" id="task-category" class="form-select"
            required bind:value={newTaskData.categoryId}>
                {#each $project.taskCategories as category}
                    <option value={category.id}>{category.name}</option>
                {/each}
            </select>
        </fieldset>
        
        <fieldset>
            <label for="task-due-at">Due Date</label>
            <input type="date" name="task-due-at" id="task-due-at" class="form-control" 
            bind:value={newTaskData.dueAt}>
        </fieldset>

        <fieldset>
            <!-- <label for="task-attachments">Choose files</label> -->
            <input type="file" name="task-attachments" id="task-attachments" multiple={true} class="form-control"
            bind:files={newTaskData.attachments}>
            {#if newTaskData.attachments}
                <div class="d-flex flex-column gap-1">
                    {#each newTaskData.attachments as attachment}
                        <p class="small m-0">{attachment.name} {parseFileSize(attachment.size)}</p>
                    {/each}
                </div>
            {/if}
        </fieldset>

        <button type="submit" class="btn btn-success">Post</button>
    </form>
</div>

<style>
    .new-task-container {
        box-shadow: var(--container-shadow);
    }
</style>