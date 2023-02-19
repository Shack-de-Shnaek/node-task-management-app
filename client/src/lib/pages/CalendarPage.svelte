<script lang="ts">
	import type { TaskData } from "$interfaces/TaskData";
	import type { CurrentRoute } from "svelte-router-spa/types/components/route";
	import { onMount } from "svelte";
	import handleResponse from "../utilities/handleResponse";
	import { Navigate } from "svelte-router-spa";
	import { cachedTasks, currentUserData, headerData } from "../../store";
	import { derived, writable, type Readable, type Writable } from "svelte/store";
	import parseDate from "../utilities/parseDate";

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
    let selectedProjectId: number;
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
        console.log('fetch')
        
        let fetchedTasks: TaskData[] = [];

        let projectId: number;
        if(window.location.search.split('project=')[1] && !isNaN(parseInt(window.location.search.split('project=')[1]))) {
            projectId = parseInt(window.location.search.split('project=')[1]);
        }

        for(const key in $cachedTasks) {
            if((projectId && $cachedTasks[key].project.id === projectId) || !projectId) fetchedTasks.push($cachedTasks[key]);
        }

        console.log(fetchedTasks);
        taskArray.set(fetchedTasks);
        try {
            const url = !!projectId ? `projects/${projectId}` : 'users';
            console.log(url)
            const res = await fetch(`/api/${url}/tasks`);
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

    const taskTitleText = (task: TaskData, mode: 'created' | 'due') => {
        let textItems = [`Title: ${task.title}`, `Project: ${task.project.name}`];
        if(mode === 'created' && task.dueAt) textItems.push(`Due: ${parseDate(task.dueAt)}`);
        else if(mode === 'due') textItems.push(`Created: ${parseDate(task.createdAt)}`);
        textItems = textItems.concat([`Severity: ${task.severity.name}`], [`Priority: ${task.priority.name}`], [`Category: ${task.category.name}`]);
        return textItems.join('; \n');
    }

    const updateSelectedProject = async () => {
        console.log('update');

        if(selectedProjectId === null) {
            window.history.replaceState(null, null, '?');
        } else {
            window.history.replaceState(null, null, `?project=${selectedProjectId}`);
        }

        console.log('ooga')
        await getTasks();
    }

    onMount(async () => {
        if(dateString === undefined) {
            const now = new Date();
            const month = (now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1);
            dateString = `${now.getFullYear()}-${month}`;
            // getTasks();
            if(window.location.search.split('project=')[1] && !isNaN(parseInt(window.location.search.split('project=')[1]))) {
                selectedProjectId = parseInt(window.location.search.split('project=')[1]);
            }
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
    <div class="calendar-header m-1 p-2 d-flex align-items-center gap-2 bg-primary">
        <input type="month" class="month-selector form-control p-1" 
        bind:value={dateString} on:change={() => dateChange()}>

        <select name="project" class="project-selector form-select p-1" 
        bind:value={selectedProjectId} on:change={() => updateSelectedProject()}>
            <option value={null}>All</option>
            {#each $currentUserData.projects as project}
                <option value={project.id}>{project.name}</option>
            {/each}
        </select>

        {#if selectedProjectId !== null}
            <div class="go-to-project p-1 bg-primary text-center">
                <Navigate to={`/projects/${selectedProjectId}`} styles="text-light">
                    <small>Go to project</small>
                </Navigate>
            </div>
        {/if}
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
                </div>
                <div class="task-list w-100 p-1 d-flex flex-column gap-1">
                    {#if day.tasksCreatedAt}
                        <small class="text-bold">Submitted: </small>
                        {#each day.tasksCreatedAt as task}
                        <Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} title={taskTitleText(task, 'created')} styles="task-link d-block text-dark small">
                            <div class="task p-1 rounded-3">
                                {task.title}
                            </div>
                        </Navigate>
                        {/each}
                    {/if}
                    {#if day.tasksDueAt}
                        <small class="text-bold">Due: </small>
                        {#each day.tasksDueAt as task}
                        <Navigate to={`/projects/${task.project.id}/tasks/${task.id}`} title={taskTitleText(task, 'due')} styles="task-link d-block text-dark small">
                            <div class="task p-1 rounded-3">
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

    .project-selector {
        padding-right: 2rem !important;
    }

    .project-selector, .month-selector {
        width: 50%;
    }

    .go-to-project {
        width: fit-content;
        white-space: nowrap;
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

    .task {
        height: fit-content;
        background-color: var(--light-gray);
        cursor: pointer;
    }

    .task:hover {
        background-color: #C3CCD5;
    }

    @media only screen and (max-width: 992px) {
        .task-list {
            min-height: 2rem;
            height: fit-content;
        }

        .go-to-project, .project-selector, .month-selector {
            width: 100%;
        }

        .calendar-header {
            flex-wrap: wrap;
        }
    }
</style>