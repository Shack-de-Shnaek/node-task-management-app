<script lang="ts">
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";

    export let currentRoute: CurrentRoute;

    let dateString: string;
    let date: {
        date: Date;
        numberOfDaysInMonth: number;
        weekdayOfFirstDay: number;
    } = { 
        date: undefined,
        numberOfDaysInMonth: undefined,
        weekdayOfFirstDay: undefined
    }
    $: if(dateString) {
        date.date = new Date(dateString);
        date.numberOfDaysInMonth = new Date(date.date.getFullYear(), date.date.getMonth() + 1, 0).getDate();
        date.weekdayOfFirstDay = date.date.getDay();
    }
</script>

<div class="calendar-container">
    <input type="month" bind:value={dateString}>
    {#each Array(6) as _, row}
        <div class="d-flex align-items-center">
            {#each Array(7) as _, column}
                <div class="m-1 p-1 bg-dark text-light rounded-circle">
                    {column} {row}
                </div>
            {/each}
        </div>
    {/each}
</div>