import { LimitedUserData } from "./UserData";

export type LimitedProjectData = {
    id: number;
    name: string;
    description: string;
}

export type ProjectData = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    leader: LimitedUserData;
    members: LimitedUserData[];
    posts: [];
    tasks: [];
    taskCategories: [];
}