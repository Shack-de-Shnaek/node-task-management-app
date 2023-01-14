import { LimitedProjectData } from "./ProjectData";

export type UserData = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    thumbnailPath: string | null;
    description: string | null;
    projects: LimitedProjectData[];
    leaderOfProjects: LimitedProjectData[];
    posts: [];
    createdTasks: [];
}

export type LimitedUserData = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    thumbnailPath: string | null;
}