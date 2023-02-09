<script lang="ts">
	import { Navigate } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
    import type { LimitedUserData } from "../../../../interfaces/UserData";
    import { currentUserIsAdmin, project } from "../pages/projects/projectStore";
	import updateAllProjectCache from "../utilities/updateProjectCache";
	import handleResponse from "../utilities/handleResponse";

    export let user: LimitedUserData;
    // export let allowRemove = false;
    // export let allowAddAdmin = false;
    export let isAdmin = false;

    const removeUser = async() => {
        try {
            const res = await fetch(`/api/projects/${$project.id}/${isAdmin?'admins':'members'}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId: user.id})
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
            });
        } catch(e) {
            console.log(e);
            alert('Could not remove the user');
        }
    }

    const addAdmin = async() => {
        try {
            const res = await fetch(`/api/projects/${$project.id}/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId: user.id})
            });
            handleResponse<ProjectData>(res, (json) => {
                updateAllProjectCache(json);
            });
        } catch (e) {
            console.log(e);
            alert('Could not add admin');
        }
    }
</script>

<div class="d-flex align-items-center flex-wrap gap-1 py-1 px-2">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={user.thumbnailPath?user.thumbnailPath:'/icons/user.webp'} alt="profile picture" style="height: 1rem;" class="rounded-circle">
    <Navigate to={`/users/${user.id}`} styles="navigate p-0 m-0 text-dark">
        <span>{user.firstName} {user.lastName}</span>
    </Navigate>
    <!-- <a href="mailto: {user.email}">{user.email}</a> -->
    {#if (!isAdmin && ($currentUserIsAdmin || $currentUserIsAdmin) || (isAdmin && $currentUserIsAdmin)) && $project.leader.id !== user.id}
        <button class="delete btn btn-danger p-1 m-0" on:click={removeUser}>
            Remove
        </button>
    {/if}
    {#if $currentUserIsAdmin && $project.leader.id !== user.id && !isAdmin}
        <button class="add-admin btn btn-success p-1 m-0" on:click={addAdmin}>
            Add Admin
        </button>
    {/if}
</div>

<style>
    /* div {
        border: 2px solid var(--bs-primary);
        border-bottom: none;
        border-top: none;
    } */
    
    button {
        width: fit-content;
        outline: none;
        border: none;
    }

    .navigate {
        background-color: inherit;
    }

    .delete, .add-admin {
        font-size: 0.75rem !important;
    }
</style>