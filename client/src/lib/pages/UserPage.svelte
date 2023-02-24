<script lang="ts">
	import { cachedUsers, currentUserData, headerData } from "../../store";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { derived, writable, type Readable, type Writable } from "svelte/store";
	import type { UserData } from "../../../../interfaces/UserData";
	import EditableTextField from "../misc/EditableTextField.svelte";
	import handleResponse from "../utilities/handleResponse";
	import { onMount } from "svelte";
	import { Navigate, navigateTo } from "svelte-router-spa";
	import Post from "../posts/Post.svelte";
	import Task from "../tasks/Task.svelte";
	import { project } from "./projects/projectStore";

    export let currentRoute: CurrentRoute;

    const user: Writable<UserData> = writable({
        id: 0,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        thumbnailPath: undefined,
        description: undefined,
        projects: undefined,
        adminOfProjects: undefined,
        leaderOfProjects: undefined,
        createdTasks: undefined,
        assignedTasks: undefined,
        posts: undefined,
    });

    const isCurrentUser: Readable<boolean> = derived([user, currentUserData], ([$user, $currentUserData]) => {
        return $user.id === $currentUserData.id;
    });

    const getUser = async () => {
        const userId = currentRoute.namedParams.userId;

        if(userId === undefined || isNaN(parseInt(userId))) {
            alert('Invalid user id');
            return;
        }

        if(parseInt(userId) === $currentUserData.id) user.set($currentUserData);
        else if($cachedUsers[parseInt(userId)] !== undefined) user.set($cachedUsers[parseInt(userId)]);

        await handleResponse<UserData>(
            `/api/users/${userId}`,
            { errorMessage: 'Could not get user' },
            (json) => {
                user.set(json);
                $cachedUsers[json.id] = json;
            },
        );
    }

    let newImage: FileList;
    const changeImage = async() => {
        if(newImage[0] === undefined) {
            alert('You need to select an image first');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async() => {
            await handleResponse<UserData>(
                '/api/users', 
                {
                    method: 'PUT',
                    body: { image: reader.result },
                    errorMessage: 'Could not change image'
                },
                (json) => {
                    user.set(json);
                },
            );
        }
        reader.readAsDataURL(newImage[0]);
    }

    const logOut = async() => {
        await handleResponse(
            '/auth/logout',
            { method: 'POST', errorMessage: 'Could not log out' },
            () => { navigateTo('login') },
        )
    }

    $: if(currentRoute.namedParams.userId !== undefined && !isNaN(parseInt(currentRoute.namedParams.userId))) {
        getUser();
    }

    onMount(() => {
        headerData.set({
            title: 'About User',
            widgets: []
        });
    });
</script>

<h2 class="mt-3">Basic Information</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light">
    <div class="col-2 col-sm-1 user-img-container px-xl-4 px-m-2 px-0">
        <img src={$user.thumbnailPath ? $user.thumbnailPath:'/icons/user.webp'} alt="user" class="user-img w-100 rounded-3">
        {#if $isCurrentUser}
            <form id="change-img-form" class="mt-2 d-flex flex-column align-items-center gap-1"
            on:submit|preventDefault={() => changeImage()}>
                <input type="file" id="user-img" class="d-none" accept="image/jpg, image/jpeg, image/webp, image/gif" bind:files={newImage}>
                <label for="user-img" class="text-center" style="cursor: pointer;"
                class:text-success={newImage!==undefined && newImage[0]!==undefined}>Choose</label>
                <button type="submit" class="p-1 btn btn-success">Save</button>
            </form>
        {/if}
    </div>
    <div class="col-sm-11 col-10">
        <div class="d-flex flex-column gap-1">
            <div>
                <h5 class="m-0">First Name</h5>
                <EditableTextField value={$user.firstName} 
                module='users' field='firstName' textType='span' objectId={$user.id} allowEditing={$isCurrentUser} useId={false} />
            </div>
            <div>
                <h5 class="m-0">Last Name</h5>
                <EditableTextField value={$user.lastName} 
                module='users' field='lastName' textType='span' objectId={$user.id} allowEditing={$isCurrentUser} useId={false} />
            </div>
            <div>
                <h5 class="m-0">Email</h5>
                <EditableTextField value={$user.email} 
                module='users' field='email' textType='span' objectId={$user.id} allowEditing={$isCurrentUser} useId={false} />
            </div>
        </div>
        <div>
            <h3>Description</h3>
            <EditableTextField value={$user.description} 
            module='users' field='description' textType='paragraph' objectId={$user.id} allowEditing={$isCurrentUser} useId={false} />
        </div>
        {#if $isCurrentUser}
            <div class="text-end">
                <button type="button" class="btn btn-danger p-1" on:click={() => logOut()}>Log Out</button>
            </div>
        {/if}
    </div>
</section>

<h2 class="mt-3">{$isCurrentUser ? 'Servers' : 'Mutual Servers'}</h2>
<section class="container-fluid row m-0 p-2 pt-3 bg-light">
    {#if $user.projects}
        <div>
            <ul class="list-unstyled">
                {#each $user.projects as project}
                    <li>
                        <Navigate to="/projects/{project.id}" title={project.name}>
                            <img src={project.thumbnailPath?project.thumbnailPath:'/icons/user.webp'} alt="" class="rounded-circle" style="height: 1rem; width: 1rem;">
                            <span>{project.name}</span>
                        </Navigate>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</section>

<section class="post-task-container container-fluid row m-0 mt-3 p-2 pt-3 shadow-none">
    {#if $user.posts}
        <div class="col-12 col-md-6 post-column">
            <h3>Posts</h3>
            <ul class="list-unstyled d-flex flex-column gap-4">
                {#each $user.posts as post}
                    <li>
                        <Post {post} isInProjectPage={false} showComments={false} componentClass="w-100" />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if $user.assignedTasks && $user.createdTasks}
        <div class="col-12 col-md-6 task-column">
            <h3>Assigned Tasks</h3>
            <ul class="list-unstyled d-flex flex-column gap-4">
                {#each $user.assignedTasks as task}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li class="m-0" style="cursor: pointer;"
                    on:click={() => { navigateTo(`/projects/${task.project.id}/tasks/${task.id}`) }}>
                        <Task {task} isInProjectPage={false} />
                    </li>
                {/each}
            </ul>
            <h3>Created Tasks</h3>
            <ul class="list-unstyled d-flex flex-column gap-4">
                {#each $user.createdTasks as task}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li class="m-0" style="cursor: pointer;"
                    on:click={() => { navigateTo(`/projects/${task.project.id}/tasks/${task.id}`) }}>
                        <Task {task} isInProjectPage={false} />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</section>

<style>
    section {
        box-shadow: var(--container-shadow);
    }
</style>