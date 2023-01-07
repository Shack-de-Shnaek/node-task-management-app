import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { UserData } from "../../interfaces/UserData";
import type { ProjectData } from "../../interfaces/ProjectData";

export type headerWidgetType = {
    label: string;
    color: string;
    value?: string | number;
    href?: string;
}

export type headerDataType = {
    title: string;
    widgets: headerWidgetType[];
}

export const currentUserData: Writable<UserData> = writable({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    projects: [],
    leaderOfProjects: [],
    posts: [],
    createdTasks: []
});

export const currentUserHasBeenRequested: Writable<boolean> = writable(false);

export const headerData: Writable<headerDataType> = writable({
    title: 'Task Manager',
    widgets: []
})

export const cachedProjects: Writable<{[id: number]: ProjectData}> = writable({})