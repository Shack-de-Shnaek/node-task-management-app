<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { onMount } from "svelte";
	import handleResponse from "../utilities/handleResponse";
	import { Navigate } from "svelte-router-spa";
	import { cachedTasks, headerData } from "../../store";
	import { derived, writable, type Readable, type Writable } from "svelte/store";

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
    type ExtendedDate = {
        date: Date;
        numberOfDaysInMonth: number;
        numberOfDaysInPreviousMonth: number;
        weekdayOfFirstDay: number;
    }

    const selectedDate: Writable<ExtendedDate> = writable({
        date: undefined,
        numberOfDaysInMonth: undefined,
        numberOfDaysInPreviousMonth: undefined,
        weekdayOfFirstDay: undefined
    });
    const taskArray: Writable<TaskData[]> = writable([]);
    const dayNumberWithTasksArray: Readable<{ date: Date, tasksCreatedAt?: TaskData[], tasksDueAt?: TaskData[] }[]> = derived([taskArray, selectedDate], ([$taskArray, $selectedDate]) => {
        let days: { date: Date, tasksCreatedAt?: TaskData[], tasksDueAt?: TaskData[] }[] = [];
        
        if($selectedDate.date === undefined) return days;

        const tasksCreatedAt: { [key: string]: TaskData[] } = {};
        const tasksDueAt: { [key: string]: TaskData[] } = {};
        for(const task of $taskArray) {
            const createdAt = task.createdAt.split('T')[0];
            const dueAt = (!!task.dueAt) ? task.dueAt.split('T')[0]: undefined;

            if(tasksCreatedAt[createdAt] === undefined) tasksCreatedAt[createdAt] = [];
            tasksCreatedAt[createdAt].push(task);
            
            if(dueAt) {
                if(tasksDueAt[dueAt] === undefined) tasksDueAt[dueAt] = [];
                tasksDueAt[dueAt].push(task);
            }
        }

        for(let i=0; i<42; i++) {         
            let dayDate: Date = new Date($selectedDate.date.getFullYear(), $selectedDate.date.getMonth(), i+1-$selectedDate.weekdayOfFirstDay, 12);


            if(i < $selectedDate.weekdayOfFirstDay) {
                if($selectedDate.date.getMonth() === 0) dayDate = new Date($selectedDate.date.getFullYear()-1, 11, 31-($selectedDate.weekdayOfFirstDay-i-1), 12);
                else dayDate = new Date($selectedDate.date.getFullYear(), $selectedDate.date.getMonth()-1, $selectedDate.numberOfDaysInPreviousMonth-($selectedDate.weekdayOfFirstDay-i-1), 12);
            }
            if(i+1-$selectedDate.weekdayOfFirstDay > $selectedDate.numberOfDaysInMonth) {
                if($selectedDate.date.getMonth() === 11) dayDate = new Date($selectedDate.date.getFullYear()+1, $selectedDate.date.getMonth()+1, i+1-$selectedDate.numberOfDaysInMonth-$selectedDate.weekdayOfFirstDay, 12);
                else dayDate = new Date($selectedDate.date.getFullYear(), $selectedDate.date.getMonth()+1, i-$selectedDate.numberOfDaysInMonth-($selectedDate.weekdayOfFirstDay-1), 12);
            }

            days.push({
                date: dayDate,
                tasksCreatedAt: tasksCreatedAt[dayDate.toISOString().split('T')[0]],
                tasksDueAt: tasksDueAt[dayDate.toISOString().split('T')[0]]
            });
        }
        return days;
    });

    const dateChange = async () => {
        const date = new Date(dateString);
        selectedDate.set({
            date: date,
            numberOfDaysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
            numberOfDaysInPreviousMonth: new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
            weekdayOfFirstDay: reorderWeekDays(date.getDay())
        });
    }

    const getTasks = async () => {
        let fetchedTasks: TaskData[] = [];
        for(const key in $cachedTasks) fetchedTasks.push($cachedTasks[key]);
        console.log(fetchedTasks)
        taskArray.set(fetchedTasks);
        try {
            const res = await fetch('api/users/tasks');
            await handleResponse<TaskData[]>(res, (json) => {
                taskArray.set(json);
                cachedTasks.update(data => {
                    for(const task of json) {
                        data[task.id] = task;                            
                    }
                    return data;
                });
            });
        } catch (e) {
            console.log(e);
            alert('Could not get tasks');
        }
    }

    const reorderWeekDays = (dayIndex: number) => {
        if(dayIndex === 0) return 6;
        return dayIndex - 1;
    }

    const datesAreEqual = (date1: Date, date2: Date) => {
        if(date1.getDate() !== date2.getDate()) return false;
        if(date1.getMonth() !== date2.getMonth()) return false;
        if(date1.getFullYear() !== date2.getFullYear()) return false;
        return true;
    }

    onMount(async () => {
        if(dateString === undefined) {
            const now = new Date();
            const month = (now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1);
            dateString = `${now.getFullYear()}-${month}`;
            getTasks();
            dateChange();
        }
        headerData.set({
            title: 'Task Calendar',
            widgets: []
        });
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
        {#each $dayNumberWithTasksArray as day}
            <div class="calendar-day bg-white border border-1 d-flex flex-column">
                <div class="calendar-day-banner"
                class:bg-primary={datesAreEqual(day.date, new Date())}
                class:text-light={datesAreEqual(day.date, new Date())}>
                    <span>{day.date.getDate()}</span>
                    <small>{day.tasksCreatedAt ? day.tasksCreatedAt.length : 0} tasks</small>
                </div>
                <div class="task-list w-100 p-1 d-flex flex-column gap-1">
                    {#if day.tasksCreatedAt}
                        {#each day.tasksCreatedAt as task}
                        <Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} title={task.title} styles="task-link d-block text-dark rounded-3 small">
                            <div class="task p-1">
                                {task.title}
                            </div>
                        </Navigate>
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}
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

    .calendar-day {
        overflow: hidden;
    }

    
    .weekday {
        flex: 1;
    }
    
    .task-list {
        overflow-y: auto;
        /* height: 6.5rem; */
    }

    .task-list::-webkit-scrollbar {
        height: 4px;
        width: 4px;
    }

    .task-list::-webkit-scrollbar-thumb {
        background-color: var(--bs-secondary);
    }

    .task-link {
        height: fit-content;
    }

    .task {
        height: fit-content;
        background-color: var(--light-gray);
        cursor: pointer;
    }

    .task:hover {
        background-color: #C3CCD5;
    }

    @media only screen and (max-width: 768px) {
        .task-list {
            min-height: 2rem;
            height: fit-content;
        }
    }
</style>