<script lang="ts">
    import { setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
    import { navigateTo } from "svelte-router-spa";
	import type { Writable } from "svelte/store";
    import NavButton from "./NavButton.svelte";
	import { currentUserData } from "../../store";
	import { headerData } from "../../store";
	import calculateTextColor from "../guards/calculateTextColor";

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

<header class="px-2 py-1 py-sm-2 d-flex justify-content-between bg-light">
    <h1 class="m-0">{$headerData.title}</h1>
    <ul class="header-widget-list list-unstyled m-0 ms-auto d-flex align-items-center justify-content-end gap-1">
        {#each $headerData.widgets as widget}
            <li class="widget px-2 py-1" style="background-color: {widget.color}">
                <a href={widget.href} style="color: {calculateTextColor(widget.color)}">
                    <span>{widget.label}</span>
                    {#if widget.value !== undefined}
                        <span>: {widget.value}</span>
                    {/if}
                </a> 
            </li>
        {/each}
    </ul>
</header>
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
            <div class="w-100 mt-0 mt-sm-auto p-0">
                <NavButton label="My account" imagePath="icons/user.png" href="my-account" />
            </div>
        {/if}
    </div>
    <div class="mobile-menu sub-menu" class:d-none={!mobileMenuExpanded || $windowWidth >= 576} >
        <NavButton label="Tasks" imagePath="icons/bug.png" href="test" />
        <NavButton label="Posts" imagePath="icons/post.png" href="posts" />
        <NavButton label="Calendar" imagePath="icons/calendar.png" href="calendar" />    
        <NavButton label="My account" imagePath="icons/user.png" href="my-account" />
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
    header {
        width: calc(100% - 4rem);
        margin-left: 4rem;
        box-shadow: 0px 5px 6px -1px var(--light-gray);
    }

    header .widget {
        border-radius: 0.9rem;
        width: fit-content;
    }

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
        background-color: var(--dark-gray);
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
        header {
            width: 100%;
            margin-left: 0rem;
        }
        
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