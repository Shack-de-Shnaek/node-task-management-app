import { type Writable, writable } from "svelte/store";
import type { ProjectData } from "../../../../../interfaces/ProjectData";

export const project: Writable<ProjectData> = writable({
    id: 0,
    name: undefined,
    description: undefined,
    isActve: undefined,
    tasks: [],
    taskCategories: [],
    posts: [],
    createdAt: undefined,
    updatedAt: undefined,
    members: [],
    admins: [],
    leader: {
        id: 0,
        email: undefined,
        firstName: undefined,
        lastName: undefined
    }
});