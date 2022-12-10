<script lang="ts">
    import { navigateTo } from "svelte-router-spa";
    import type { Writable } from "svelte/store";
    import { getContext, onMount } from "svelte";

    const expanded: Writable<boolean> = getContext('navbarExpanded');

    export let componentClass = '';
    export let componentStyle = '';
    export let imagePath: string;
    export let label: string;
    export let href: string = undefined;
    export let click: (event?: MouseEvent) => void = undefined;
</script>

{#if href !== undefined && click === undefined}
    <button class="w-100 d-flex gap-2 align-items-center nav-button {componentClass}" class:expanded={$expanded} style="{componentStyle}" on:click={() => navigateTo(href)}>
        <img src={imagePath} alt={label} style="width: 2.5rem; filter: invert(1)">
        <div class="nav-button-label" class:d-none={!$expanded}>{label}</div>
    </button>
{:else if click !== undefined && href === undefined}
    <button class="w-100 d-flex gap-2 align-items-center nav-button {componentClass}" class:expanded={$expanded} style="{componentStyle}" on:click={click}>
        <img src={imagePath} alt={label} style="width: 2.5rem; filter: invert(1)">
        <div class="nav-button-label" class:d-none={!$expanded}>{label}</div>
    </button>
{/if}

<style>
    button {
        background: inherit;
        border: none;
    }
    
    .nav-button {
        margin: 0 auto;
        padding: 0.5rem 0.75rem;
        flex-direction: column;
        align-items: center;
        color: white;
        outline: none;
    }

    .nav-button:hover, .nav-button:focus {
        background-color: #3f3f3f;
    }

    .nav-button.expanded {
        flex-direction: row;
        justify-items: start;
    }

    .nav-button-label {
        font-size: 1.25rem;
    }
</style>