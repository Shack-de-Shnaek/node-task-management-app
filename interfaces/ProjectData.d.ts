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
    isActve: boolean;
    createdAt: string;
    updatedAt: string;
    leader: LimitedUserData;
    admins: LimitedUserData[];
    members: LimitedUserData[];
    posts: [];
    tasks: [];
    taskCategories: [];
}