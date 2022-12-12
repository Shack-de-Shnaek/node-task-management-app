<script lang="ts">
    import { setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
	import type { Writable } from "svelte/store";
    import NavButton from "./NavButton.svelte";

    const windowWidth: Writable<number> = getContext('windowWidth');
    
    const navbarExpanded = writable(false);

    setContext('navbarExpanded', navbarExpanded);

    const expandNavbar = () => {
        if($windowWidth < 576) return;
        $navbarExpanded = true;
    }
    const closeNavbar = () => {
        if($windowWidth < 576) return;
        $navbarExpanded = false;
    }
</script>


<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<nav class="position-fixed bg-dark text-light d-flex flex-sm-column align-items-sm-start align-items-center justify-content-sm-start justify-content-center gap-2 gap-sm-0" 
class:expanded={$navbarExpanded} 
on:mouseenter={expandNavbar} on:focusin={expandNavbar} on:focusout={closeNavbar} on:mouseleave={closeNavbar} >

    <NavButton label="Home" imagePath="icons/home.png" href="/" />
    <NavButton label="Projects" imagePath="icons/project.png" click={() => {alert('projects')}} />
        
    {#if $windowWidth < 576}
        <NavButton label="Menu" imagePath="icons/menu.png" href="test" />
    {:else}
        <NavButton label="Tasks" imagePath="icons/bug.png" href="test" />
        <NavButton label="Posts" imagePath="icons/post.png" href="posts" />
        <NavButton label="Calendar" imagePath="icons/calendar.png" href="calendar" />
    {/if}

    <NavButton label="My account" imagePath="icons/user.png" href="my-account" componentClass="mt-sm-auto" />
</nav>

<style>
    nav {
        left: 0;
        top: 0;
        width: 4rem;
        height: 100%;
    }

    nav.expanded {
        width: 12rem;
    }

    @media only screen and (max-width: 576px) {
        nav {
            top: unset;
            bottom: 0;
            width: 100%;
            height: 4rem;
        }
    }
</style>