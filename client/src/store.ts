import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { UserData } from "../../interfaces/UserData";

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