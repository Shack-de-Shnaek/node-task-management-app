import { Prisma } from "@prisma/client";
import { userLimitedSelector } from "./userSelectors";
import { postSelector } from "./postSelectors";

export const projectLimitedSelector: { select: Prisma.ProjectSelect, orderBy?: Prisma.ProjectOrderByWithRelationInput  } = {
    select: {
        id: true,
        name: true,
        thumbnailPath: true,
    },
    orderBy: {
        updatedAt: 'desc'
    }
}

export const projectSelector: { select: Prisma.ProjectSelect, orderBy?: Prisma.ProjectOrderByWithRelationInput  } = {
    select: {
        id: true,
        name: true,
        description: true,
        thumbnailPath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        leader: {
            select: userLimitedSelector.select
        },
        members: userLimitedSelector,
        admins: userLimitedSelector,
        posts: postSelector,
        tasks: true,
    },
    orderBy: {
        updatedAt: 'desc'
    }
}