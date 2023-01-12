import { Prisma } from "@prisma/client"
import { projectLimitedSelector } from "./projectSelectors"

export const userLimitedSelector: Prisma.UserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
}

export const userSelector: Prisma.UserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
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
        select: {
            id: true,
            title: true,
            content: true
        }
    },
    createdTasks: {
        select: {
            id: true,
            title: true,
            description: true
        }
    }
}