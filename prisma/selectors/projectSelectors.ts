import { Prisma } from "@prisma/client"
import { postSelector } from "./postSelectors"
import { userLimitedSelector } from "./userSelectors"

export const projectLimitedSelector: Prisma.ProjectSelect = {
    id: true,
    name: true,
    description: true,
    thumbnailPath: true,
}

export const projectSelector: Prisma.ProjectSelect = {
    id: true,
    name: true,
    description: true,
    thumbnailPath: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    leader: {
        select: userLimitedSelector
    },
    members: {
        select: userLimitedSelector
    },
    admins: {
        select: userLimitedSelector
    },
    posts: {
        select: postSelector
    },
    tasks: true,
}