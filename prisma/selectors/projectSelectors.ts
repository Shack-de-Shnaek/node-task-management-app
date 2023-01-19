import { Prisma } from "@prisma/client";
import { userLimitedSelector } from "./userSelectors";
import { postSelector } from "./postSelectors";
import { taskSelector } from "./taskSelectors";

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
        taskCategories: {
            select: {
                id: true,
                name: true,
                color: true,
            }
        },
        tasks: taskSelector,
    },
    orderBy: {
        updatedAt: 'desc'
    }
}