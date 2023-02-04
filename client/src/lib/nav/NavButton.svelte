<script lang="ts">
    import { Navigate } from "svelte-router-spa";
    import type { Writable } from "svelte/store";
    import { getContext } from "svelte";

    const expanded: Writable<boolean> = getContext('mainMenuExpanded');

    export let isStaticButton = false;

    export let componentClass = '';
    export let componentStyle = '';
    export let imagePath = '';
    export let label: string = undefined;
    export let href: string = undefined;
    export let click: (event?: MouseEvent) => void = undefined;

    let expand;
    $: expand = () => {
        if(isStaticButton) return true;
        return $expanded;
    }

</script>

{#if href === undefined && click !== undefined}
    <button class="d-flex gap-2 align-items-center nav-button {componentClass}" class:expanded={expand} style="{componentStyle}" on:click={click}>
        {#if imagePath !== ''}
            <img src={imagePath} alt={label} style="width: 2.5rem; filter: invert(1)">
        {/if}
        <div class="nav-button-label" class:d-none={!expand()}>{label}</div>
    </button>
{:else}
    <div class="nav-button" class:expanded={expand}>
        <Navigate to={href} styles="w-100 text-light">
            <div class="d-flex gap-2 align-items-center">
                {#if imagePath !== ''}
                    <img src={imagePath} alt={label} style="width: 2.5rem; filter: invert(1)">
                {/if}
                <div class="nav-button-label" class:d-none={!expand()}>{label}</div>
            </div>
        </Navigate>
    </div>
{/if}

<style>
    button {
        background: inherit;
        border: none;
    }
    
    .nav-button {
        width: 100%;
        /* margin: 0 auto; */
        padding: 0.5rem 0.75rem;
        flex-direction: column;
        color: white;
        outline: none;
        transition: 0.2s;
    }
    
    @media (pointer: fine) {
        .nav-button:hover, .nav-button:focus {
            background-color: #3f3f3f;
        }
    }

    .nav-button.expanded {
        flex-direction: row;
        justify-items: start;
    }

    .nav-button-label {
        font-size: 1.25rem;
        overflow: hidden;
        white-space: nowrap;
    }

    @media only screen and (max-width: 577px) {
        .nav-button {
            justify-content: center;
            width: 4rem;
            height: 100%;
            /* margin: 0; */
        }
    }
</style>