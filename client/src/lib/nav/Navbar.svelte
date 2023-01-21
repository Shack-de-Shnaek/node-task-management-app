<script lang="ts">
    import { setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
    import { navigateTo } from "svelte-router-spa";
	import type { Writable } from "svelte/store";
    import NavButton from "./NavButton.svelte";
	import { currentUserData } from "../../store";
	import clickOutside from "../utilities/clickOutside";

    const windowWidth: Writable<number> = getContext('windowWidth');

    const mainMenuExpanded = writable(false);
    let mobileMenuExpanded = false;
    let projectMenuExpanded = false;
    
    setContext('mainMenuExpanded', mainMenuExpanded);

    const expandMainMenu = () => {
        if($windowWidth < 576) return;
        $mainMenuExpanded = true;
    }
    const closeMainMenu = () => {
        if($windowWidth < 576) return;
        $mainMenuExpanded = false;
    }

    const toggleMobileMenu = () => {
        mobileMenuExpanded = !mobileMenuExpanded;
    }

    const toggleProjectMenu = () => {
        projectMenuExpanded = !projectMenuExpanded;
    }
</script>

<nav class="position-fixed bg-dark text-light d-flex flex-sm-row flex-column-reverse">
    <div class="main-menu sub-menu" class:expanded={$mainMenuExpanded}
    on:mouseenter={expandMainMenu} on:focusin={expandMainMenu} on:focusout={closeMainMenu} on:mouseleave={closeMainMenu}>
        <NavButton label="Home" imagePath="/icons/home.png" href="/" />
        <NavButton label="Projects" imagePath="/icons/project.png" click={toggleProjectMenu} />
        {#if $windowWidth < 576}
            <NavButton label="Menu" imagePath="/icons/menu.png" click={toggleMobileMenu} />
        {:else}
            <NavButton label="Tasks" imagePath="/icons/bug.png" href="test" />
            <NavButton label="Posts" imagePath="/icons/post.png" href="posts" />
            <NavButton label="Calendar" imagePath="/icons/calendar.png" href="calendar" />
            <div class="w-100 mt-0 mt-sm-auto p-0">
                <NavButton label="My account" imagePath="/icons/user.png" href="my-account" />
            </div>
        {/if}
    </div>
    <div class="mobile-menu sub-menu" class:d-none={!mobileMenuExpanded || $windowWidth >= 576}  use:clickOutside on:click_outside={() => { mobileMenuExpanded = false }}>
        <NavButton label="Tasks" imagePath="/icons/bug.png" href="test" />
        <NavButton label="Posts" imagePath="/icons/post.png" href="posts" />
        <NavButton label="Calendar" imagePath="/icons/calendar.png" href="calendar" />    
        <NavButton label="My account" imagePath="/icons/user.png" href="my-account" />
    </div>
    <div class="project-menu sub-menu m-0" class:d-none={!projectMenuExpanded} use:clickOutside on:click_outside={() => { projectMenuExpanded = false }}>
        <button on:click={() => navigateTo('/new-project')} class="new-project w-100 m-0 p-2 d-flex align-items-center gap-1 text-light">
            <img src="/icons/add.png" alt="" style="width: 1rem; filter: invert(1)">
            <span>New project</span>
        </button>
        {#each $currentUserData.projects as project}
            <button class="project px-2 py-1 border-0 w-100 text-white text-start"
            on:click={() => navigateTo(`/projects/${project.id}`)}>
                {project.name}
            </button>
        {/each}
    </div>
</nav>

<style>
    nav {
        left: 0;
        top: 0;
        width: fit-content;
        height: 100%;
        z-index: 1000;
    }

    .sub-menu {
        margin: 0 !important;
        display: flex;
        flex-direction: column;
        justify-content: start;
        transition: 0.2s;
    }

    .main-menu {
        transition: 0.2s;
    }

    .main-menu.expanded {
        width: 12rem;
        align-items: flex-start;
    }

    .project-menu {
        max-width: 16rem;
        background-color: var(--dark-gray);
    }

    .project {
        width: 12rem;
    }

    .project {
        background: inherit;
        outline: none;
    }

    .project:hover, .project:focus {
        background-color: var(--bs-gray);
    }

    button.new-project {
        background-color: var(--dark-green);
        outline: none;
        border: none;
    }

    button.new-project:hover, button.new-project:focus {
        background-color: var(--green);
        outline: none;
        border: none;
    }

    @media only screen and (max-width: 577px) {
        nav {
            top: unset;
            bottom: 0;
            width: 100%;
            height: fit-content;
            gap: 0rem !important;
        }

        .sub-menu {
            gap: 2rem;
            justify-content: center;
            flex-direction: row;
            padding-bottom: 0.75rem;
        }
        
        .main-menu {
            padding: 0;
        }

        .project-menu {
            max-width: none;
            padding-bottom: 0.75rem;
            flex-direction: column;
            justify-content: start;
            gap: 0.5rem;
        }
        
        .project {
            width: 100%;
        }
    }

</style>