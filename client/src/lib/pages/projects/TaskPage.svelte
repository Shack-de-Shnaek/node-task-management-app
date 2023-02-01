<script lang="ts">
	import { cachedProjects, headerData } from "../../../store";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import type { TaskAttachmentData, TaskData } from "../../../../../interfaces/TaskData";
	import { project, taskPriorities, taskSeverities, taskStatuses } from "./projectStore";
	import type { NestError } from "../../../../../interfaces/NestError";
	import { writable, type Writable } from "svelte/store";
	import { setContext } from "svelte";
	import TaskSelectField from "../../tasks/TaskSelectField.svelte";
	import { getContext } from "svelte";
	import handleResponse from "../../utilities/handleResponse";
	import updateTaskInProjectCache from "../../utilities/updateTaskInProjectCache";
	import EditableTextField from "../../misc/EditableTextField.svelte";
	import parseDate from "../../utilities/parseDate";
	import parseFileSize from "../../utilities/parseFileSize";
	import uploadMultipleAttachments from "../../utilities/uploadMultipleAttachments";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import { navigateTo } from "svelte-router-spa";
	import parseParagraphs from "../../utilities/parseParagraphs";

    export let currentRoute: CurrentRoute;
    let task: Writable<TaskData> = writable({
        id: 0,
        title: undefined,
        description: undefined,
        category: undefined,
        severity: undefined,
        priority: undefined,
        status: undefined,
        project: undefined,
        createdBy: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        assignedTo: undefined,
        assignedAt: undefined,
        attachments: undefined,
        comments: undefined,
        dueAt: undefined,
    });

    setContext('task', task);
    const currentUserIsAdmin: Writable<boolean> = getContext('currentUserIsAdmin');
    const currentUserIsMember: Writable<boolean> = getContext('currentUserIsMember');

    let images: TaskAttachmentData[] = [];
    $: if($task.id !== parseInt(currentRoute.namedParams.taskId)) {
        (async() => {
            await getTask();
            images = $task.attachments.filter(attachment => attachment.isImage);
            if($task.dueAt) newDueAtDate = new Date($task.dueAt).toISOString().split('T')[0];
            if($task.id !== 0) {
                headerData.set({
                    title: 'Task Information',
                    widgets: [
                        {
                            label: 'Project',
                            href: `/projects/${$task.project.id}`,
                            color: '#3485FE'
                        },
                        {
                            label: 'All Tasks',
                            href: `/projects/${$task.project.id}/tasks`,
                            color: '#fd7e14'
                        }
                    ]
                });
            }
        })();
    }

    const getTask = async() => {
        if(!currentRoute.namedParams.taskId || isNaN(parseInt(currentRoute.namedParams.taskId))) {
            alert('Invalid task ID');
        }
        
        const fetchedTaskData: TaskData = $project.tasks.find(t => t.id === parseInt(currentRoute.namedParams.taskId));
        if(fetchedTaskData !== undefined) task.set(fetchedTaskData);
        
        for(const key in $cachedProjects) {
            const cachedTask = $cachedProjects[key].tasks.find(t => t.id === parseInt(currentRoute.namedParams.taskId));
            if(cachedTask !== undefined) {
                task.set(cachedTask)
                return;
            }
        }
        
        try {
            const res = await fetch(`/api/tasks/${currentRoute.namedParams.taskId}`);
            if(res.ok) {
                const json = await res.json();
                task.set(json);
            } else {
                const json: NestError = await res.json();
                alert(json.message)
            }
        } catch (e) {
            alert('Could not fetch task data');
            console.log(e);
        }
    }

    let taskNewAttachments: FileList;
    const uploadAttachments = async() => {
        await uploadMultipleAttachments<TaskData>(
            `/api/tasks/${$task.id}`,
            'PUT',
            taskNewAttachments,
            (data) => {
                updateTaskInProjectCache(data);
                task.set(data);
                images = $task.attachments.filter(attachment => attachment.isImage);
            }
        );
    }

    const deleteTask = async() => {
        if(!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const res = await fetch(`/api/projects/${$project.id}/tasks/${$task.id}`, {
                method: 'DELETE',
            });
            await handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
                navigateTo(`/projects/${$project.id}/tasks`);
            });
        } catch (e) {
            console.log(e);
            alert('Could not delete task');
        }
    }

    let newDueAtDate: string;
    const updateDueAt = async() => {
        try {
            const res = await fetch(`/api/tasks/${$task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dueAt: new Date(newDueAtDate).toISOString() })
            });
            handleResponse<TaskData>(res, (json) => {
                updateTaskInProjectCache(json);
                task.set(json);
            });
        } catch (e) {
            console.log(e);
            alert('Could not update due at date');
        }
    }

    let newCommentData: { content: string, attachments: FileList } = {
        content: '',
        attachments: undefined,
    }
    const postComment = async() => {
        uploadMultipleAttachments<TaskData>(
            `/api/tasks/${$task.id}/comments`,
            'POST',
            newCommentData.attachments,
            (data) => {
                updateTaskInProjectCache(data);
                task.set(data);
                newCommentData = {
                    content: '',
                    attachments: undefined,
                }
            },
            { content: newCommentData.content }
        );
    }
</script>

<div class="task-container w-100 mt-1 px-3 d-flex flex-column gap-2">
    <section class="row p-2 bg-light">
        <div class="date-container col-12 px-1 py-1 py-md-0 col-md-4 text-start text-md-center small">
            <span>Created At:</span>
            <span class="date-field p-1 rounded-3 text-light">{parseDate($task.createdAt)}</span>
        </div>
        <div class="date-container col-12 px-1 py-1 py-md-0 col-md-4 text-start text-md-center small">
            <span>Updated At:</span>
            <span class="date-field p-1 rounded-3 text-light">{parseDate($task.updatedAt)}</span>
        </div>
        <div class="date-container col-12 px-1 py-1 py-md-0 col-md-4 text-start text-md-center small">
            <span>Assigned At:</span>
            <span class="date-field p-1 rounded-3 text-light">
                {#if $task.assignedAt}
                    {parseDate($task.assignedAt)}
                {:else}
                    Not Assigned                
                {/if}
            </span>
        </div>
    </section>

    <section class="row p-2 flex-column flex-sm-row bg-light">
        <div class="task-selector py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Severity</span>
            {#if $taskSeverities.length > 0}
                <TaskSelectField field='severityCode' options={$taskSeverities} />
            {/if}
        </div>
        <div class="task-selector py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Priority</span>
            {#if $taskPriorities.length > 0}
                <TaskSelectField field='priorityCode' options={$taskPriorities} />
            {/if}
        </div>
        <div class="task-selector py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Status</span>
            {#if $project.id !== 0}
                <TaskSelectField field='statusCode' options={$taskStatuses} />
            {/if}
        </div>
        <div class="task-due-date py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Due At</span>
            <input type="date" name="task-due-date" class="form-control p-1"
            bind:value={newDueAtDate} on:change={() => {updateDueAt()}}>
        </div>        
    </section>

    <section class="row p-2 flex-column flex-sm-row bg-light">
        <div class="task-selector py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Category</span>
            {#if $project.id !== 0}
                <TaskSelectField field='categoryId' options={$project.taskCategories} />
            {/if}
        </div>
        <div class="task-selector py-1 col-12 col-sm-6 d-flex align-items-center gap-1">
            <span>Assigned To</span>
            {#if $project.id !== 0}
                <TaskSelectField field='assignedToId' options={$project.members} />
            {/if}
        </div>
        
    </section>

    <section class="row p-2 py-3 bg-light">
        <div class="col-12 col-md-5 col-xl-4 pb-3">
            <h3>Attachments</h3>
            {#if images.length > 0}
                <div class="carousel slide" id="task-carousel" data-bs-ride="carousel" data-bs-interval="false">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src={images[0].path} alt="" class="w-100">
                        </div>
                        {#each images.slice(1) as image}
                            <div class="carousel-item">
                                <img src={image.path} alt="" class="w-100">
                            </div>
                        {/each}
                    </div>
                    {#if images.length > 1}
                        <button class="carousel-control-prev" type="button" data-bs-target="#task-carousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#task-carousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    {/if}
                </div>
            {/if}
            {#if $task.id !== 0 && $task.attachments.filter(attachment => !attachment.isImage).length > 0}
                <div class="attachments p-2 d-flex flex-column gap-1">
                    <h5 class="m-0">Attachments</h5>
                    {#each $task.attachments as attachment}
                        <a href={attachment.path} target="_blank" rel="noreferrer" class="attachment text-primary">{attachment.path.split('/')[3]}</a>
                    {/each}
                </div>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <form class="mt-2"
            on:submit|preventDefault={() => {uploadAttachments()}}>
                <div class="d-flex align-items-center gap-1">
                    <input type="file" name="task-attachments" id="task-attachments" multiple={true} class="form-control"
                    bind:files={taskNewAttachments}>
                    <button type="submit" class="btn btn-success p-1"><small>Submit</small></button>
                </div>
                {#if taskNewAttachments}
                    <div class="d-flex flex-column gap-1">
                        {#each taskNewAttachments as attachment}
                            <p class="small m-0">{attachment.name} {parseFileSize(attachment.size)}</p>
                        {/each}
                    </div>
                {/if}
            </form>
        </div>
        <div class="col-12 col-md-7 col-xl-8 d-flex flex-column gap-2">
            <div>
                <h3>Name</h3>
                <EditableTextField allowEditing={$currentUserIsMember} module="tasks" field="title" objectId={$task.id} value={$task.title} />
            </div>
            <div>
                <h3>Description</h3>
                <EditableTextField allowEditing={$currentUserIsMember} module="tasks" field="description" objectId={$task.id} value={$task.description} textType="paragraph" />
            </div>
            <div>
                <h4>Created By</h4>
                {#if $task.id !== 0}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div style="cursor: pointer"
                    on:click={() => {navigateTo(`/users/${$task.createdBy.id}`)}}>{$task.createdBy.firstName} {$task.createdBy.lastName}</div>
                {/if}
            </div>
            <button class="delete-button btn btn-danger mt-auto ms-auto p-1"
            on:click={() => deleteTask()}><small>Delete</small></button>
        </div>
    </section>

    <section class="row p-2 py-3 bg-light">
        <form class="w-100"
        on:submit|preventDefault={() => { postComment() }}>
            <textarea name="task-comment-content" rows="3" placeholder="New Comment" class="form-control"
            bind:value={newCommentData.content}></textarea>
            
            <div class="d-flex mt-1 align-items-center gap-1">
                <input type="file" name="task-comment-attachment" class="form-control"
                bind:files={newCommentData.attachments}>
            
                <button type="submit" class="btn btn-success p-1">
                    <small>Post</small>
                </button>
            </div>
        </form>
        <div class="comment-list mt-3 d-flex flex-column gap-2">
            {#if $task.id !== 0}
                {#each $task.comments as comment}
                    <div class="comment w-100">
                        <div class="d-flex justify-content-between gap-0 justify-content-md-start gap-md-5 ">
                            <span class="">
                                {#if comment.author.thumbnailPath}
                                    <img src={comment.author.thumbnailPath} alt="" style="height: 1rem;" class="rounded-circle">
                                {/if}
                                <span>{comment.author.firstName} {comment.author.lastName}</span>
                            </span>
                            <span class="">{parseDate(comment.createdAt)}</span>
                        </div>
                        <div class="w-100 rounded-3 p-1 comment-content">
                            {#each parseParagraphs(comment.content) as paragraph}
                                <p class="mb-1">{paragraph}</p>
                            {/each}
                        </div>
                        {#if comment.attachments.length > 0}
                            <div class="comment-attachments mt-1">
                                <h6 class="m-0">Attachments </h6>
                                {#each comment.attachments as attachment}
                                    <a href={attachment.path} target="_blank" rel="noreferrer" class="small">{attachment.path}</a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </section>
</div>

<style>
    section {
        box-shadow: var(--container-shadow);
    }

    .task-selector {
        min-width: 12rem;
    }

    .task-selector span, .task-due-date span {
        min-width: 27.5%;
    }

    .date-container {
        min-width: fit-content;
    }

    .date-field {
        background: var(--light-blue);
    }

    .delete-button {
        width: fit-content;
    }

    .comment-content {
        background: var(--light-gray);
    }
</style>