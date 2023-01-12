<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
    import type { LimitedUserData } from "../../../../interfaces/UserData";

    export let user: LimitedUserData;
</script>

<div class="d-flex align-items-center flex-wrap gap-1">
    <button class="p-0 m-0" on:click={() => navigateTo(`/users/${user.id}`)}>
        <span>{user.firstName} {user.lastName}</span>
    </button>
    <a href="mailto: {user.email}">{user.email}</a>
</div>

<style>
    button {
        width: fit-content;
        outline: none;
        border: none;
        background-color: inherit;
    }

    a {
        width: fit-content;
    }
</style>