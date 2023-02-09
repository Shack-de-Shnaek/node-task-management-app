import { currentUserData } from "../../../store";
import { type Writable, type Readable, writable, derived } from "svelte/store";
import type { ProjectData } from "../../../../../interfaces/ProjectData";
import type { TaskSeverityData, TaskPriorityData, TaskStatusData } from "../../../../../interfaces/TaskData";

export const project: Writable<ProjectData> = writable({
    id: 0,
    name: undefined,
    description: undefined,
    thumbnailPath: undefined,
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
        lastName: undefined,
        thumbnailPath: undefined
    }
});

export const taskSeverities: Writable<TaskSeverityData[]> = writable([]);
export const taskPriorities: Writable<TaskPriorityData[]> = writable([]);
export const taskStatuses: Writable<TaskStatusData[]> = writable([]);

export const currentUserIsLeader: Readable<boolean> = derived([project, currentUserData], ([$project, $currentUserData]) => {
    return $project.leader.id === $currentUserData.id
});
export const currentUserIsAdmin: Readable<boolean> = derived([project, currentUserData], ([$project, $currentUserData]) => {
    return $project.admins.flatMap(admin => admin.id).includes($currentUserData.id)
});
export const currentUserIsMember: Readable<boolean> = derived([project, currentUserData], ([$project, $currentUserData]) => {
    return $project.members.flatMap(member => member.id).includes($currentUserData.id)
});