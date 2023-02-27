<script lang="ts">
	import { onMount } from "svelte";
	import { Navigate, navigateTo } from "svelte-router-spa";
	import { derived } from "svelte/store";
    import { currentUserData } from "../../store";
    import { headerData } from "../../store";
	import Widget from "../misc/Widget.svelte";
	import InlineTask from "../tasks/InlineTask.svelte";

    const unfinishedTasks = derived(currentUserData, ($currentUserData) => {
        return $currentUserData.assignedTasks.filter(task => !['rejected', 'fixed'].includes(task.status.code));
    });

    const overdueTasks = derived(unfinishedTasks, ($unfinishedTasks) => {
        return $unfinishedTasks.filter(task => {
            if(!task.dueAt) return false;
            const delta = Math.round((new Date(task.dueAt).getTime() - new Date().getTime()) / 1000 / 3600 / 24);
            return delta <= 0;
        }).sort((a, b) => {
            const days1 = Math.round(new Date(a.dueAt).getTime() / 360000 / 24);
            const days2 = Math.round(new Date(b.dueAt).getTime() / 360000 / 24)
            return days1 - days2;
        });
    });

    onMount(() => {
        headerData.set({
            title: 'Home',
            widgets: [
                {
                    label: 'Calendar',
                    color: '#0275d8',
                    href: 'calendar'
                }
            ]
        });
    });
</script>

<div class="container-fluid m-0 row p-2 py-1">
    <div class="col-12 col-md-6 col-lg-4 px-1 py-1 px-md-3 py-md-0">
        <Widget label="Unfinished Tasks" value={$unfinishedTasks.length} componentClass="btn-warning p-1 p-md-2" />
    </div>
    <div class="col-12 col-md-6 col-lg-4 px-1 py-1 px-md-3 py-md-0">
        <Widget label="Overdue Tasks" value={$overdueTasks.length} componentClass="btn-danger p-1 p-md-2" />
    </div>
    <div class="col-12 col-md-6 col-lg-4 px-1 py-1 px-md-3 py-md-0">
        <Widget label="All Posts" href="posts" componentClass="btn-primary p-1 p-md-2" />
    </div>
</div>

<h2 class="mt-2">Projects</h2>
<section class="section row">
    <div class="project-list-container">
        <ul class="list-unstyled project-list d-flex flex-column gap-2">
            {#each $currentUserData.projects as project}
                <li>
                    <Navigate to="projects/{project.id}" title={project.name} styles="text-dark">
                        <div class="project p-2 rounded-3 d-flex align-items-center gap-2">
                            <img src={project.thumbnailPath?project.thumbnailPath:'/icons/project.webp'} alt="" class="rounded-circle" style="height: 2rem; width: 2rem;">
                            <h6 class="m-0 text-start">{project.name}</h6>
                        </div>
                    </Navigate>
                </li>
            {/each}
        </ul>
    </div>
</section>

<section class="section task-section row mt-3 shadow-none gap-3 gap-md-0">
    {#if $currentUserData.assignedTasks && $currentUserData.createdTasks}
        <div class="col-12 col-md-6 ps-0 pe-9 pe-md-2 d-flex flex-column gap-2">
            <h3>Unfinished Tasks</h3>
            <ul class="list-unstyled section d-flex flex-column gap-2">
                {#each $unfinishedTasks as task}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li class="m-0" style="cursor: pointer;"
                    on:click={() => { navigateTo(`/projects/${task.project.id}/tasks/${task.id}`) }}>
                        <!-- <Task {task} isInProjectPage={false} /> -->
                        <InlineTask {task} mode="show" isInProjectPage={false} />
                    </li>
                {/each}
            </ul>
        </div>
        <div class="col-12 col-md-6 pe-0 ps-0 ps-md-2 d-flex flex-column gap-2">
            <h3>Overdue Tasks</h3>
            <ul class="list-unstyled section d-flex flex-column gap-2">
                {#each $overdueTasks as task}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li class="m-0" style="cursor: pointer;"
                    on:click={() => { navigateTo(`/projects/${task.project.id}/tasks/${task.id}`) }}>
                        <!-- <Task {task} isInProjectPage={false} /> -->
                        <InlineTask {task} mode="showRemainingDays" isInProjectPage={false} />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</section>

<style>
    .project {
        background-color: var(--bs-light);
        transition: 0.5s;
    }
    
    .project:hover {
        background-color: var(--bs-white);
    }

    .task-section {
        background-color: var(--light);
    }
</style>