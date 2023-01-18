import { LimitedUserData } from "./UserData";

export type PostCommentData = {
    id: number;
    content: string;
    createdAt: string;
    author: LimitedUserData;
}

export type PostData = {
    id: number;
    project: {
        id: number;
        name: string;
        thumbnailPath: string;
    },
    author: LimitedUserData;
    title: string;
    content: string;
    attachments: {
        id: number;
        path: string;
        isImage: boolean;
    }[],
    createdAt: string;
    comments: PostCommentData[];
}