import { LimitedProjectData } from "./ProjectData";
import { LimitedUserData } from "./UserData";

export type TaskData = {
    id: number;
    title: string;
    description: string;
    category: TaskCategoryData,
    status: TaskStatusData,
    severity: TaskSeverityData,
    priority: TaskPriorityData,
    project: LimitedProjectData,
    createdBy: LimitedUserData,
    createdAt: string;
    attachments: TaskAttachmentData[],
    comments: TaskCommentData[],
    assignedTo: LimitedUserData,
    createdAt: string;
    assignedAt: string;
    dueAt: string;
}

export type TaskCategoryData = {
    id: number;
    name: string;
    color: string;
}

export type TaskStatusData = {
    id: number;
    code: string;
    name: string;
    description: string;
    color: string;
}

export type TaskSeverityData = {
    id: number;
    code: string;
    name: string;
    description: string;
    color: string;
}

export type TaskPriorityData = {
    id: number;
    code: string;
    name: string;
    description: string;
    color: string;
}

export type TaskCommentData = {
    id: number,
    author: LimitedUserData,
    attachments: TaskAttachment[],
    content: string;
    createdAt: string;
}

export type TaskAttachmentData = {
    id: number;
    isImage: boolean;
    path: string;
}

export type TaskSeverityPriorityStatus = {
    severities: TaskSeverityData[];
    priorities: TaskPriorityData[],
    statuses: TaskStatusData[]
}