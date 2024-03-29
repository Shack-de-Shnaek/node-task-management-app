import { Prisma } from "@prisma/client";

export const postSelector: { select: Prisma.PostSelect, orderBy?: Prisma.PostOrderByWithRelationInput } = {
    select: {
        id: true,
        project: {
            select: {
                id: true,
                name: true,
                thumbnailPath: true,
            }
        },
        author: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                thumbnailPath: true,
            }
        },
        createdAt: true,
        title: true,
        content: true,
        attachments: {
            select: {
                id: true,
                path: true,
                isImage: true,
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
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        }
    },
    orderBy: {
        createdAt: 'desc'
    }
}