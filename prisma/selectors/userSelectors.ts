import { Prisma } from "@prisma/client"
import { postSelector } from "./postSelectors"
import { projectLimitedSelector } from "./projectSelectors"

export const userLimitedSelector: { select: Prisma.UserSelect, orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]} = {
    select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        thumbnailPath: true,
    },
    orderBy: [
        {
            lastName: 'desc',
        },
        {
            firstName: 'desc'
        }
    ]
}

export const userSelector: { select: Prisma.UserSelect, orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]} = {
    select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        thumbnailPath: true,
        password: false,
        description: true,
        projects: projectLimitedSelector,
        leaderOfProjects: projectLimitedSelector,
        adminOfProjects: projectLimitedSelector,
        posts: postSelector,
        createdTasks: {
            select: {
                id: true,
                title: true,
                description: true
            }
        },
    },
    orderBy: [
        {
            lastName: 'desc',
        },
        {
            firstName: 'desc'
        }
    ]
}