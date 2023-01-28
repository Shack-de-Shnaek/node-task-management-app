import { Prisma } from "@prisma/client";

export const taskSelector: { select: Prisma.TaskSelect, orderBy: Prisma.TaskOrderByWithRelationInput[] } = {
    select: {
        id: true,
        title: true,
        description: true,
        category: {
            select: {
                id: true,
                name: true,
                color: true,
            }
        },
        severity: {
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                color: true,
            }
        },
        priority: {
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                color: true,
            }
        },
        status: {
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                color: true,
            }
        },
        createdBy: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                thumbnailPath: true,
            }
        },
        createdAt: true,
        updatedAt: true,
        assignedTo: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                thumbnailPath: true,
            }
        },
        assignedAt: true,
        project: {
            select: {
                id: true,
                name: true,
                thumbnailPath: true,
            }
        },
        comments: {
            select: {
                id: true,
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        thumbnailPath: true,
                    }
                },
                attachments: {
                    select: {
                        id: true,
                        isImage: true,
                        path: true
                    }
                },
                content: true,
                createdAt: true
            },
        },
        attachments: {
            select: {
                id: true,
                isImage: true,
                path: true
            }
        },
        dueAt: true,
    },  
    orderBy: [
        {
            severity: {
                id: 'desc'
            }
        },
        {
            priority: {
                id: 'desc'
            }
        },
        {
            createdAt: 'desc'
        }
    ],
}