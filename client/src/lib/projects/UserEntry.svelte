<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
	import type { ProjectData } from "../../../../interfaces/ProjectData";
    import type { LimitedUserData } from "../../../../interfaces/UserData";
    import type { NestError } from "../../../../interfaces/NestError";
    import { project } from "../pages/projects/projectStore";
    import { cachedProjects } from "../../store";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import updateAllProjectCache from "../utilities/updateProjectCache";
    
    const currentUserIsLeader: Writable<boolean> = getContext('currentUserIsLeader');
    const currentUserIsAdmin: Writable<boolean> = getContext('currentUserIsAdmin');

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
            if(res.ok) {
                const json: ProjectData = await res.json();
                updateAllProjectCache(json);
            } else {
                const json: NestError = await res.json()
                if(json.message) alert(json.message);
                else alert('Could not remove the user');
            }
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
            if(res.ok) {
                const json: ProjectData = await res.json();
                updateAllProjectCache(json);
            } else {
                const json: NestError = await res.json()
                if(json.message) alert(json.message);
                else alert('Could not remove the user');
            }
        } catch (e) {
            console.log(e);
            alert('Could not add admin');
        }
    }
</script>

<div class="d-flex align-items-center flex-wrap gap-1 py-1 px-2">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={user.thumbnailPath?user.thumbnailPath:'/icons/user.png'} alt="profile picture" style="height: 1rem;" class="rounded-circle">
    <button class="navigate p-0 m-0" on:click={() => navigateTo(`/users/${user.id}`)}>
        <span>{user.firstName} {user.lastName}</span>
    </button>
    <!-- <a href="mailto: {user.email}">{user.email}</a> -->
    {#if (!isAdmin && ($currentUserIsAdmin || $currentUserIsLeader) || (isAdmin && $currentUserIsLeader)) && $project.leader.id !== user.id}
        <button class="delete btn btn-danger p-1 m-0" on:click={removeUser}>
            Remove
        </button>
    {/if}
    {#if $currentUserIsLeader && $project.leader.id !== user.id && !isAdmin}
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