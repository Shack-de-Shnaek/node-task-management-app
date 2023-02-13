<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { onMount } from "svelte";
	import handleResponse from "../utilities/handleResponse";
	import { Navigate } from "svelte-router-spa";

    export let currentRoute: CurrentRoute;

    const numberToWeekdayMap = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday'
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

    let tasks: {
        tasksCreatedAt: { [key: string]: TaskData[] },
        tasksDueAt: { [key: string]: TaskData[] },
    }

    const dateChange = async () => {
        date.date = new Date(dateString);
        date.numberOfDaysInMonth = new Date(date.date.getFullYear(), date.date.getMonth() + 1, 0).getDate();
        date.numberOfDaysInPreviousMonth = new Date(date.date.getFullYear(), date.date.getMonth(), 0).getDate();
        date.weekdayOfFirstDay = reorderWeekDays(date.date.getDay());
        tasks = await getTasks();
        dayNumberArray = getDayNumberArray();
    }

    const getDayNumberArray = () => {
        let days: { date: Date, tasks?: TaskData[] }[] = [];
        for(let i=0; i<42; i++) {            
            let dayDate: Date = new Date(date.date.getFullYear(), date.date.getMonth(), i+1-date.weekdayOfFirstDay);;

            if(i < date.weekdayOfFirstDay) {
                if(date.date.getMonth() === 0) dayDate = new Date(date.date.getFullYear()-1, 11, 31-(date.weekdayOfFirstDay-i-1));
                else dayDate = new Date(date.date.getFullYear(), date.date.getMonth()-1, date.numberOfDaysInPreviousMonth-(date.weekdayOfFirstDay-i-1));
            }
            if(i+1-date.weekdayOfFirstDay > date.numberOfDaysInMonth) {
                if(date.date.getMonth() === 11) dayDate = new Date(date.date.getFullYear()+1, date.date.getMonth(), i+1-date.numberOfDaysInMonth-date.weekdayOfFirstDay);
                else dayDate = new Date(date.date.getFullYear(), date.date.getMonth(), i-date.numberOfDaysInMonth-(date.weekdayOfFirstDay-1));
            }
            
            days.push({
                date: dayDate,
                tasks: tasks.tasksCreatedAt[dayDate.toISOString().split('T')[0]]
            });
        }
        return days;
    }

    const getTasks = async () => {
        try {
            const res = await fetch('api/users/tasks');
            let taskArr: TaskData[] = [];
            await handleResponse<TaskData[]>(res, (json) => {
                taskArr = json;
            });
            const tasksCreatedAt: { [key: string]: TaskData[] } = {};
            const tasksDueAt: { [key: string]: TaskData[] } = {};
            for(const task of taskArr) {
                const createdAt = task.createdAt.split('T')[0];
                const dueAt = (!!task.dueAt) ? task.dueAt.split('T')[0]: undefined;

                if(tasksCreatedAt[createdAt] === undefined) tasksCreatedAt[createdAt] = [];
                tasksCreatedAt[createdAt].push(task);
                
                if(dueAt) {
                    if(tasksDueAt[dueAt] === undefined) tasksDueAt[dueAt] = [];
                    tasksDueAt[dueAt].push(task);
                }
            }
            return { tasksCreatedAt: tasksCreatedAt, tasksDueAt: tasksDueAt };
        } catch (e) {
            console.log(e);
            alert('Could not get tasks');
        }
    }

    const reorderWeekDays = (dayIndex: number) => {
        if(dayIndex === 0) return 6;
        return dayIndex - 1;
    }

    onMount(() => {
        if(dateString === undefined) {
            const now = new Date();
            const month = (now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1);
            dateString = `${now.getFullYear()}-${month}`;
            dateChange();
        }
    });
</script>

<div class="calendar-container mt-3 p-2 bg-light">
    <div class="bg-primary w-100 p-2 text-center">
        <input type="month" bind:value={dateString} on:change={() => dateChange()}>
    </div>
    <div class="weekdays-container d-none d-lg-flex justify-content-evenly">
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Monday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Tuesday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Wednesday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Thursday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Friday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Saturday</h5>
        </div>
        <div class="weekday text-center m-1 p-1">
            <h5 class="m-0">Sunday</h5>
        </div>
    </div>
    <div class="calendar-days-container w-100 p-1 d-flex flex-column d-lg-grid">
        {#if tasks}
            {#each dayNumberArray as day}
                <div class="calendar-day p-1 bg-white border border-1">
                    <div class="calendar-day-banner">
                        <span>{day.date.getDate()}</span>
                        <span>{day.tasks ? day.tasks.length : 0} tasks</span>
                    </div>
                    <div class="task-list w-100">
                        {#if day.tasks}
                            {#each day.tasks as task}
                                <div class="task p-1">
                                    <Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} title={task.title} />
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .calendar-container {
        box-shadow: var(--container-shadow);
    }

    .calendar-days-container {
        /* display: grid; */
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 8rem);
    }

    .calendar-day .task-list {
        overflow-y: scroll;
    }

    .weekday {
        flex: 1;
    }
</style>