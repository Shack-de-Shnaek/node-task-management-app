import { PostData } from "./PostData";
import { LimitedProjectData } from "./ProjectData";
import { LimitedTaskData } from "./TaskData";

export type UserData = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    thumbnailPath: string | null;
    description: string | null;
    projects: LimitedProjectData[];
    leaderOfProjects: LimitedProjectData[];
    adminOfProjects: LimitedProjectData[];
    posts: PostData[];
    createdTasks: LimitedTaskData[];
    assignedTasks: LimitedTaskData[];
}

export type LimitedUserData = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    thumbnailPath: string | null;
}