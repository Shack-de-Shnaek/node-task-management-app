import { LimitedProjectData } from "./ProjectData";

export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    description: string | null;
    projects: LimitedProjectData[];
    leaderOfProjects: LimitedProjectData[];
    posts: [];
    createdTasks: [];
}

export type LimitedUserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}