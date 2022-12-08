<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import NavButton from "./NavButton.svelte";

    let windowWidth: number;
    let navbarExpanded = writable(false);

    setContext('navbarExpanded', navbarExpanded);

    const expandNavbar = () => {
        $navbarExpanded = true;
    }
    const closeNavbar = () => {
        $navbarExpanded = false;
    }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<nav class="position-fixed h-100 bg-dark text-light" class:expanded={$navbarExpanded} 
on:mouseover={expandNavbar} on:focus={expandNavbar} on:blur={closeNavbar} on:mouseout={closeNavbar} >

    <NavButton caption="home" href={'/'} />
</nav>

<style>
    nav {
        left: 0;
        top: 0;
        width: 4rem;
    }

    nav.expanded {
        width: 12rem;
    }
</style>