<script lang="ts">
	import { cachedUsers, currentUserData } from "../../store";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { derived, writable, type Readable, type Writable } from "svelte/store";
	import type { UserData } from "../../../../interfaces/UserData";
	import EditableTextField from "../misc/EditableTextField.svelte";
	import handleResponse from "../utilities/handleResponse";
	import { project } from "./projects/projectStore";
	import { onMount } from "svelte";

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
        try {
            const userId = currentRoute.namedParams.userId;

            if(userId === undefined || isNaN(parseInt(userId))) {
                alert('Invalid user id');
                return;
            }

            if(parseInt(userId) === $currentUserData.id) user.set($currentUserData);
            else if($cachedUsers[parseInt(userId)] !== undefined) user.set($cachedUsers[parseInt(userId)]);

            const res = await fetch(`/api/users/${userId}`);
            await handleResponse<UserData>(res, (json) => {
                user.set(json);
                $cachedUsers[json.id] = json;
            });
        } catch (e) {
            console.log(e);
            alert('Could not get user');
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
                const res = await fetch('/api/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: reader.result })
                });
                handleResponse<UserData>(res, (json) => {
                    user.set(json);
                });
            } catch (e) {
                alert('Could not change image');
                console.log(e)
            }
        }
        reader.readAsDataURL(newImage[0]);
    }

    $: if(currentRoute.namedParams.userId !== undefined && parseInt(currentRoute.namedParams.userId) !== $project.id) {
        getUser();
    }

    // onMount(async() => {
    //     await getUser();
    // });
</script>

<h2 class="mt-3">About User</h2>
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
            <h3>Basic Information</h3>
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
    </div>
</section>