import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { UserData } from "../../interfaces/UserData";
import type { ProjectData } from "../../interfaces/ProjectData";
import type { TaskData } from "../../interfaces/TaskData";

export type headerWidgetType = {
    label: string;
    color: string;
    value?: string | number | Writable<string | number>;
    href?: string;
}

export type headerDataType = {
    title: string | Writable<string>;
    widgets: headerWidgetType[];
}

export const currentUserData: Writable<UserData> = writable({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    thumbnailPath: '',
    description: '',
    projects: [],
    leaderOfProjects: [],
    adminOfProjects: [],
    posts: [],
    createdTasks: [],
    assignedTasks: []
});

export const currentUserHasBeenRequested: Writable<boolean> = writable(false);

export const headerData: Writable<headerDataType> = writable({
    title: 'Task Manager',
    widgets: []
});

interface CachedProjects extends Object {
    [id: number]: ProjectData,
}

export const cachedProjects: Writable<CachedProjects> = writable({});

interface CachedTasks extends Object {
    [id: number]: TaskData,
}

export const cachedTasks: Writable<CachedTasks> = writable({});

interface CachedUsers extends Object {
    [id: number]: UserData,
}

export const cachedUsers: Writable<CachedUsers> = writable({});