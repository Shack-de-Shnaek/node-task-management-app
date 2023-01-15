import { Prisma } from "@prisma/client";
import { userLimitedSelector } from "./userSelectors";

export const postSelector: Prisma.PostSelect = {
    id: true,
    project: {
        select: {
            id: true,
            name: true,
            thumbnailPath: true,
        }
    },
    author: {
        select: userLimitedSelector,
    },
    title: true,
    content: true,
    attachments: {
        select: {
            id: true,
            path: true,
            isImage: true,
        }
    },
}