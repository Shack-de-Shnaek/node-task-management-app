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
            if(res.ok) {
                const json: ProjectData = await res.json();
                updateAllProjectCache(json);
                newMemberEmail = '';
            } else {
                const json: NestError = await res.json();
                alert(json.message);
            }
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
                if(res.ok) {
                    const json: ProjectData = await res.json();
                    updateAllProjectCache(json);
                } else {
                    const json: NestError = await res.json();
                    alert(json.message);
                }
            } catch (e) {
                alert('Could not change image');
                console.log(e)
            }
        }
        reader.readAsDataURL(newImage[0]);
    }
</script>

<h1 class="mt-3">About Project</h1>
<section class="container-fluid row m-0 p-2 pt-3 bg-light ">
    <div class="col-2 col-sm-1 project-img-container px-xl-4 px-m-2 px-0">
        <img src={$project.thumbnailPath?$project.thumbnailPath:'/icons/project.png'} alt="project" class="project-img w-100 rounded-3">
        {#if $currentUserIsAdmin}
            <form id="change-img-form" class="mt-2 d-flex flex-column align-items-center gap-1"
            on:submit|preventDefault={() => changeImage()}>
                <input type="file" id="project-img" class="d-none" bind:files={newImage}>
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

<h1 class="mt-3">The Team</h1>
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
            <form id="new-member-form" class="d-flex align-items-center gap-1 mb-1" on:submit|preventDefault={() => addMember()}>
                <input type="email" id="new-member-email-input" placeholder="Email" required bind:value={newMemberEmail}>
                <button type="submit" class="btn btn-success p-1">Add Member</button>
            </form>
        {/if}
        {#each $project.members as member}
            <UserEntry user={member}  />
        {/each}
    </div>
</section>

<style>
    section {
        box-shadow: var(--container-shadow);
    }

    /* .leader-admins, .member-list {
        width: fit-content;
    } */

    #new-member-email-input {
        background: inherit;
        border: none;
        border-bottom: 2px solid var(--dark-gray);
        outline: none;
        font-size: 0.75rem;
        transition: 0.2s all;
    }

    #new-member-email-input:focus {
        border: none;
        border-bottom: 2px solid var(--bs-primary);
    }

    #new-member-form [type=submit] {
        font-size: 0.75rem;
    }

    #change-img-form > * {
        outline: none;
        border: none;
        font-size: 0.75rem;
    }
</style>