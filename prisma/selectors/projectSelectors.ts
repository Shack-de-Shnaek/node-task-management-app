import { userLimitedSelector } from "./userSelectors"

export const projectLimitedSelector = {
    id: true,
    name: true,
    description: true,
}

export const projectSelector = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    leader: {
        select: userLimitedSelector
    },
    members: {
        select: userLimitedSelector
    },
    posts: true,
    tasks: true,
}