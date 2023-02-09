<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import handleResponse from "../utilities/handleResponse";

    export let currentRoute: CurrentRoute;

    const numberToWeekdayMap = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    let dateString: string;
    let date: {
        date: Date;
        numberOfDaysInMonth: number;
        numberOfDaysInPreviousMonth: number;
        weekdayOfFirstDay: number;
    } = { 
        date: undefined,
        numberOfDaysInMonth: undefined,
        numberOfDaysInPreviousMonth: undefined,
        weekdayOfFirstDay: undefined
    }

    let dayNumberArray: { date: Date, tasks?: TaskData[] }[] = [];

    let tasks: TaskData[] = [];

    const dateChange = async () => {
        date.date = new Date(dateString);
        date.numberOfDaysInMonth = new Date(date.date.getFullYear(), date.date.getMonth() + 1, 0).getDate();
        date.numberOfDaysInPreviousMonth = new Date(date.date.getFullYear(), date.date.getMonth(), 0).getDate();
        date.weekdayOfFirstDay = reorderWeekDays(date.date.getDay());
        dayNumberArray = getDayNumberArray();
        console.log(dayNumberArray);
        tasks = await getTasks();
        console.log(tasks);
    }

    const getDayNumberArray = () => {
        let days: { date: Date, tasks?: TaskData[] }[] = [];
        // const offset = 6 - date.weekdayOfFirstDay;
        for(let i=0; i<42; i++) {
            // if(i <= offset) days.push(date.numberOfDaysInPreviousMonth - (offset - i - 1));
            // else if(i < date.numberOfDaysInMonth + offset) days.push(i - offset + 1);
            // else days.push(i - offset - date.numberOfDaysInMonth + 1);
            
            if(i < date.weekdayOfFirstDay) {
                if(date.date.getMonth() === 0) days.push({
                    date: new Date(date.date.getFullYear()-1, 11, 31-(date.weekdayOfFirstDay-i-1)),
                });
                else days.push({
                    date: new Date(date.date.getFullYear(), date.date.getMonth()-1, date.numberOfDaysInPreviousMonth-(date.weekdayOfFirstDay-i-1))
                });
                continue;
            }
            if(i+1-date.weekdayOfFirstDay > date.numberOfDaysInMonth) {
                if(date.date.getMonth() === 11) days.push({
                    date: new Date(date.date.getFullYear()+1, date.date.getMonth(), i+1-date.numberOfDaysInMonth-date.weekdayOfFirstDay)
                });
                else days.push({
                    date: new Date(date.date.getFullYear(), date.date.getMonth(), i-date.numberOfDaysInMonth-(date.weekdayOfFirstDay-1))
                });
                continue;
            }
            days.push({
                date: new Date(date.date.getFullYear(), date.date.getMonth(), i+1-date.weekdayOfFirstDay)
            });
        }
        return days;
    }

    const getTasks = async () => {
        try {
            const res = await fetch('api/users/tasks');
            let taskArr = [];
            await handleResponse<TaskData[]>(res, (json) => {
                taskArr = json;
            });
            return taskArr;
        } catch (e) {
            console.log(e);
            alert('Could not get tasks');
        }
    }

    const reorderWeekDays = (dayIndex: number) => {
        if(dayIndex === 0) return 6;
        return dayIndex - 1;
    }
</script>

<div class="calendar-container mt-3 bg-light">
    <div class="bg-primary w-100 p-2 text-center">
        <input type="month" bind:value={dateString} on:change={() => dateChange()}>
    </div>
    <div class="calendar-days-container p-1 d-grid">
        {#each dayNumberArray as day}
            <div class="m-1 p-1 border border-dark border-1">
                {day.date.getDate()}
            </div>
        {/each}
    </div>
</div>

<style>
    .calendar-container {
        box-shadow: var(--container-shadow);
    }

    .calendar-days-container {
        grid-template-columns: repeat(7, 8rem);
        grid-template-rows: repeat(6, 8rem);
        gap: 0.2rem;
    }
</style>