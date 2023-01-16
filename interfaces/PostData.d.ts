import { LimitedUserData } from "./UserData";

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
    }[]
}