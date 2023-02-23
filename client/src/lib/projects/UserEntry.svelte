<script lang="ts">
	import { Navigate } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
    import type { LimitedUserData } from "../../../../interfaces/UserData";
    import { currentUserIsAdmin, currentUserIsLeader, project } from "../pages/projects/projectStore";
	import updateAllProjectCache from "../utilities/updateProjectCache";
	import handleResponse from "../utilities/handleResponse";
	import { currentUserData } from "../../store";

    export let user: LimitedUserData;
    export let isAdmin = false;
    let isCurrentUser = $currentUserData.id === user.id;
    let userIsProjectAdmin = $project.admins.flatMap(a => a.id).includes(user.id);

    $: userIsProjectAdmin = $project.admins.flatMap(a => a.id).includes(user.id);

    const removeUser = async() => {
        let url = `/api/projects/${$project.id}/${isAdmin?'admins':'members'}`;
        if(isCurrentUser) url += '/self';
        const headers = isCurrentUser ? undefined : { 'Content-Type': 'application/json' }
        const body = isCurrentUser && !isAdmin ? undefined : { userId: user.id };
        await handleResponse<ProjectData>(
            `/api/projects/${$project.id}/${isAdmin?'admins':'members'}`,
            {
                method: 'DELETE',
                headers: headers,
                body: body,
                errorMessage: 'Could not remove the user'
            },
            (json) => {
                updateAllProjectCache(json);
            },
        );
    }

    const addAdmin = async() => {
        await handleResponse<ProjectData>(
            `/api/projects/${$project.id}/admins`,
            {
                method: 'POST',
                body: { userId: user.id },
                errorMessage: 'Could not add admin'
            },
            (json) => {
                updateAllProjectCache(json);
            },
        );
    }
</script>

<div class="d-flex align-items-center flex-wrap gap-1 py-1 px-2">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={user.thumbnailPath?user.thumbnailPath:'/icons/user.webp'} alt="profile picture" style="height: 1rem;" class="rounded-circle">
    <Navigate to={`/users/${user.id}`} styles="navigate p-0 m-0 text-dark">
        <span>{user.firstName} {user.lastName}</span>
    </Navigate>
    <!-- <a href="mailto: {user.email}">{user.email}</a> -->
    {#if $project.leader.id !== user.id && (isCurrentUser || ($currentUserIsAdmin && !isAdmin) || $currentUserIsLeader)}
        <button class="delete btn btn-danger p-1 m-0" on:click={removeUser}>
            Remove
        </button>
    {/if}
    {#if $project.leader.id !== user.id && !isAdmin && $currentUserIsLeader && !userIsProjectAdmin}
        <button class="add-admin btn btn-success p-1 m-0" on:click={addAdmin}>
            Add Admin
        </button>
    {/if}
</div>

<style>
    button {
        width: fit-content;
        outline: none;
        border: none;
    }

    .delete, .add-admin {
        font-size: 0.75rem !important;
    }
</style>