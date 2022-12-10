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
<nav class="position-fixed h-100 bg-dark text-light d-flex flex-column" class:expanded={$navbarExpanded} 
on:mouseover={expandNavbar} on:focusin={expandNavbar} on:focusout={closeNavbar} on:mouseout={closeNavbar} >

    <NavButton label="Home" imagePath="icons/home.png" href="/" />
    <NavButton label="Projects" imagePath="icons/project.png" click={() => {alert('projects')}} />
    <NavButton label="Tasks" imagePath="icons/bug.png" href="test" />
    <NavButton label="Posts" imagePath="icons/post.png" href="posts" />
    <NavButton label="Calendar" imagePath="icons/calendar.png" href="calendar" />

    <NavButton label="My account" imagePath="icons/user.png" href="my-account" componentClass="mt-auto" />
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