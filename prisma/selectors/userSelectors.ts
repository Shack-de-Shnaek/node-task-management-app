import { Prisma } from "@prisma/client"
import { postSelector } from "./postSelectors"
import { projectLimitedSelector } from "./projectSelectors"

export const userLimitedSelector: Prisma.UserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    thumbnailPath: true,
}

export const userSelector: Prisma.UserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    thumbnailPath: true,
    password: false,
    description: true,
    projects: {
        select: {
            id: true,
            name: true,
            description: true
        }
    },
    leaderOfProjects: {
        select: projectLimitedSelector
    },
    adminOfProjects: {
        select: projectLimitedSelector
    },
    posts: {
        select: postSelector
    },
    createdTasks: {
        select: {
            id: true,
            title: true,
            description: true
        }
    }
}