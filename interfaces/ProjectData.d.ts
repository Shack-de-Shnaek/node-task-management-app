import { PostData } from "./PostData";
import { TaskCategoryData, TaskData } from "./TaskData";
import { LimitedUserData } from "./UserData";

export type LimitedProjectData = {
    id: number;
    name: string;
    description: string;
    thumbnailPath: string | null;
}

export type ProjectData = {
    id: number;
    name: string;
    description: string;
    thumbnailPath: string | null;
    isActve: boolean;
    createdAt: string;
    updatedAt: string;
    leader: LimitedUserData;
    admins: LimitedUserData[];
    members: LimitedUserData[];
    posts: PostData[];
    tasks: TaskData[];
    taskCategories: TaskCategoryData[];
}