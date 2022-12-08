<script lang="ts">
    import type { Writable } from "svelte/store";
    import { getContext, onMount } from "svelte";

    let expanded: Writable<boolean> = getContext('navbarExpanded');

    export let caption: string;
    export let href: string;
</script>

<a class="d-flex align-items-center nav-button" class:expanded={$expanded} href={href}>
    <img src="../../public/icons/home.png" alt="" style="width: 2.5rem; filter: invert(1)">
    <div class="nav-button-caption" class:d-none={!$expanded}>{caption}</div>
</a>

<style>
    .nav-button {
        margin: 0 auto;
        padding: 0.5rem 0.75rem;
        flex-direction: column;
        align-items: center;
        color: white;
    }

    .nav-button:hover {
        background-color: #3f3f3f;
    }

    .nav-button.expanded {
        flex-direction: row;
        justify-items: start;
        gap: 1rem;
    }

    .nav-button-caption {
        font-size: 1.5rem;
    }
</style>