<script lang="ts">
    import { setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
    import { navigateTo } from "svelte-router-spa";
	import type { Writable } from "svelte/store";
    import NavButton from "./NavButton.svelte";
	import { currentUserData } from "../../store";

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
        projectMenuExpanded = false;
    }

    const toggleProjectMenu = () => {
        projectMenuExpanded = !projectMenuExpanded;
        mobileMenuExpanded = false;
    }
</script>

<nav class="position-fixed bg-dark text-light d-flex flex-sm-row flex-column-reverse">
    <div class="main-menu sub-menu" class:expanded={$mainMenuExpanded}
    on:mouseenter={expandMainMenu} on:focusin={expandMainMenu} on:focusout={closeMainMenu} on:mouseleave={closeMainMenu}>
        <NavButton label="Home" imagePath="icons/home.png" href="/" />
        <NavButton label="Projects" imagePath="icons/project.png" click={toggleProjectMenu} />
        {#if $windowWidth < 576}
            <NavButton label="Menu" imagePath="icons/menu.png" click={toggleMobileMenu} />
        {:else}
            <NavButton label="Tasks" imagePath="icons/bug.png" href="test" />
            <NavButton label="Posts" imagePath="icons/post.png" href="posts" />
            <NavButton label="Calendar" imagePath="icons/calendar.png" href="calendar" />
        {/if}
    </div>
    <div class="mobile-menu sub-menu" class:d-none={!mobileMenuExpanded || $windowWidth >= 576} >
        <NavButton label="Tasks" imagePath="icons/bug.png" href="test" />
        <NavButton label="Posts" imagePath="icons/post.png" href="posts" />
        <NavButton label="Calendar" imagePath="icons/calendar.png" href="calendar" />    
    </div>
    <ul class="project-menu sub-menu m-0 list-unstyled" class:d-none={!projectMenuExpanded}>
        {#each $currentUserData.projects as project}
            <li class="project px-2 py-1">
                <button class="border-0 w-100 text-white text-start"
                on:click={() => navigateTo(`/project/${project.id}`)}>
                    {project.name}
                </button>
            </li>
        {/each}
    </ul>
</nav>

<style>
    nav {
        left: 0;
        top: 0;
        width: fit-content;
        height: 100%;
    }

    .sub-menu {
        margin: 0 !important;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }

    .main-menu.expanded {
        width: 12rem;
        align-items: flex-start;
    }

    .project-menu {
        background-color: var(--bs-gray-dark);
    }

    .project {
        width: 12rem;
    }

    .project button {
        background: inherit;
        outline: none;
        padding: 0;
    }

    .project:hover, .project:focus {
        background-color: #3f3f3f;
    }

    @media only screen and (max-width: 576px) {
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
            padding-bottom: 0.5rem;
            padding-top: 0.25rem;

        }
        
        .main-menu {
            padding: 0;
        }

        .project-menu {
            flex-direction: column;
            justify-content: start;
            gap: 0.5rem;
            padding-bottom: 0.75rem;
        }
        
        .project {
            width: 100%;
        }
    }

</style>