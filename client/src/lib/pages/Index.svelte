<script lang="ts">
    import { currentUserData } from "../../store";
</script>

<h1>index</h1>
<h1>fdsadafsdsf</h1>

<button on:click={async() => {
    try {
        const res = await fetch('/auth/logout', { method: 'POST', redirect: 'follow' });
        window.location.href = res.url;
    } catch(e) {
        console.log(e);
    }
}}>
    log out
</button>

{#if $currentUserData.firstName !== ''}
    <h1>Hello, {$currentUserData.firstName} {$currentUserData.lastName}!</h1>
{/if}