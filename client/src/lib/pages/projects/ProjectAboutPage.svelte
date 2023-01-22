<script lang="ts">
    import UserEntry from "../../projects/UserEntry.svelte";
    import { project } from "./projectStore";
    import { cachedProjects, currentUserData } from "../../../store";
	import parseDate from "../../utilities/parseDate";
	import EditableTextField from "../../misc/EditableTextField.svelte";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { NestError } from "../../../../../interfaces/NestError";
	import type { ProjectData } from "../../../../../interfaces/ProjectData";
	import updateAllProjectCache from "../../utilities/updateProjectCache";
	import handleResponse from "../../utilities/handleResponse";
	import type { TaskCategoryData } from "../../../../../interfaces/TaskData";
	import calculateTextColor from "../../utilities/calculateTextColor";

    const currentUserIsAdmin: Writable<boolean> = getContext('currentUserIsAdmin');

    let newMemberEmail = '';
    const addMember = async() => {
        try {
            const res = await fetch(`/api/projects/${$project.id}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: newMemberEmail})
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
                newMemberEmail = '';
            });
        } catch (e) {
            console.log(e);
            alert('Could not add member to project');
        }
    }

    let newImage: FileList;
    const changeImage = async() => {
        if(newImage[0] === undefined) {
            alert('You need to select an image first');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async() => {
            try {
                const res = await fetch(`/api/projects/${$project.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: reader.result })
                });
                handleResponse<ProjectData>(res, (json) => {
                    updateAllProjectCache(json);
                });
            } catch (e) {
                alert('Could not change image');
                console.log(e)
            }
        }
        reader.readAsDataURL(newImage[0]);
    }

    let newTaskCategory = {
        name: '',
        color: ''
    }
    const addTaskCategory = async() => {
        if(newTaskCategory.name === '') {
            alert('You need to specify a name your category')   ;
            return;
        }
        try {
            const res = await fetch(`/api/projects/${$project.id}/task-categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTaskCategory)
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
            });
        } catch (e) {
            alert('Could not add task category');
            console.log(e)
        }
    }

    const removeTaskCategory = async(taskCategoryId: number) => {
        try {
            const res = await fetch(`/api/projects/${$project.id}/task-categories/${taskCategoryId}`, {
                method: 'DELETE',
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
            });
        } catch (e) {
            alert('Could not remove task category');
            console.log(e)
        }
    }
</script>

<h2 class="mt-3">About Project</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light ">
    <div class="col-2 col-sm-1 project-img-container px-xl-4 px-m-2 px-0">
        <img src={$project.thumbnailPath?$project.thumbnailPath:'/icons/project.png'} alt="project" class="project-img w-100 rounded-3">
        {#if $currentUserIsAdmin}
            <form id="change-img-form" class="mt-2 d-flex flex-column align-items-center gap-1"
            on:submit|preventDefault={() => changeImage()}>
                <input type="file" id="project-img" class="d-none" accept="image/jpg, image/jpeg, image/png, image/gif" bind:files={newImage}>
                <label for="project-img" class="text-center" style="cursor: pointer;"
                class:text-success={newImage!==undefined && newImage[0]!==undefined}>Choose</label>
                <button type="submit" class="p-1 btn btn-success">Save</button>
            </form>
        {/if}
    </div>
    <div class="col-sm-11 col-10">
        <div>
            <h3>Name</h3>
            <EditableTextField value={$project.name} 
            module='projects' field='name' textType='span' objectId={$project.id} allowEditing={$currentUserIsAdmin} />
        </div>
        <div>
            <h3>Description</h3>
            <EditableTextField value={$project.description} 
            module='projects' field='description' textType='paragraph' objectId={$project.id} allowEditing={$currentUserIsAdmin} />
        </div>
        <div>
            <h4>Created On: </h4>
            <p>{parseDate($project.createdAt)}</p>
        </div>
    </div>
</section>

<h2 class="mt-3">The Team</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light gap-3">
    <div class="leader-admins row col-md-6 col-12 gap-3">
        <div class="leader col-12">
            <h3>Leader</h3>
            <UserEntry user={$project.leader} />
        </div>
            <div class="admin-list col-12">
                <h3>Admins</h3>
                {#each $project.admins as admin}
                    <UserEntry user={admin} isAdmin={true} />
                {/each}
            </div>
    </div>
    <div class="member-list col-md-6 col-12">
        <h3>Members</h3>
        {#if $currentUserIsAdmin}
            <form id="new-member-form" class="d-flex align-items-center gap-1 mb-1" 
            on:submit|preventDefault={() => addMember()}>
                <input type="email" id="new-member-email-input" placeholder="Email" class="form-control"
                required bind:value={newMemberEmail}>
                <button type="submit" class="btn btn-success p-1">Add Member</button>
            </form>
        {/if}
        {#each $project.members as member}
            <UserEntry user={member}  />
        {/each}
    </div>
</section>

<h2 class="mt-3">Task Categories</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light">
    <ul class="col-12 col-sm-6 m-0 list-unstyled d-flex flex-column gap-1">
        {#each $project.taskCategories as category}
            <li class="d-flex gap-1">
                <span>{category.name}</span>
                <span style="background-color: {category.color}; color: {calculateTextColor(category.color)}; font-size: 0.75rem"
                class="rounded-3 p-1">{category.color}</span>
                <button class="btn btn-danger p-1" on:click={() => removeTaskCategory(category.id)}>Remove</button>
            </li>
        {/each}
    </ul>
    {#if $currentUserIsAdmin}
        <form id="new-category-form" class="col-12 col-sm-6 d-flex align-items-center gap-1"
        on:submit|preventDefault={() => addTaskCategory()}>
            <input type="text" name="category-name" placeholder="Category Name" class="form-control"
            bind:value={newTaskCategory.name}>
            <input type="color" name="category-color" class="form-color"
            bind:value={newTaskCategory.color}>
            <button type="submit" class="btn btn-success p-1">Add Category</button>
        </form>
    {/if}
</section>


<style>
    section {
        box-shadow: var(--container-shadow);
    }

    button {
        font-size: 0.75rem !important;
    }

    #change-img-form > * {
        outline: none;
        border: none;
        font-size: 0.75rem;
    }
</style>