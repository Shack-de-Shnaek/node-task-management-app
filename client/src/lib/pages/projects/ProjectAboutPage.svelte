<script lang="ts">
    import UserEntry from "../../projects/UserEntry.svelte";
    import { project } from "./projectStore";
    import { currentUserData } from "../../../store";
	import parseDate from "../../utilities/parseDate";
	import EditableTextField from "../../misc/EditableTextField.svelte";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

    const currentUserIsAdmin: Writable<boolean> = getContext('currentUserIsAdmin');
</script>

<h1 class="mt-3">About Project</h1>
<section class="container-fluid row m-0 p-2 pt-3 bg-light ">
    <div class="col-2 col-sm-1 project-img-container px-xl-4 px-m-2 px-0">
        <img src={$project.thumbnailPath?$project.thumbnailPath:'/icons/project.png'} alt="project" class="project-img w-100 rounded-3">
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

</style>