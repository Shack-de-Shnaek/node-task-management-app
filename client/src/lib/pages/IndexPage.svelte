<script lang="ts">
	import { onMount } from "svelte";
	import { derived } from "svelte/store";
    import { currentUserData } from "../../store";
    import { headerData } from "../../store";
	import Widget from "../misc/Widget.svelte";

    const unfinishedTasks = derived(currentUserData, ($currentUserData) => {
        return $currentUserData.assignedTasks.filter(task => !['rejected', 'fixed'].includes(task.status.code));
    });

    const overdueTasks = derived(currentUserData, ($currentUserData) => {
        return $currentUserData.assignedTasks.filter(task => {
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
    <div class="col-12 col-md-6 px-1 py-1 px-md-3 py-md-0">
        <Widget label="Unfinished Tasks" value={$unfinishedTasks.length} componentClass="btn-warning p-1 p-md-2" />
    </div>
    <div class="col-12 col-md-6 px-1 py-1 px-md-3 py-md-0">
        <Widget label="Overdue Tasks" value={$overdueTasks.length} componentClass="btn-danger p-1 p-md-2" />
    </div>
</div>