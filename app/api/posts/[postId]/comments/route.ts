import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/libs/prismadb';


export async function GET(req: Request, context) {
    // get comments

    const userId = context.params;

    let comments;

    if (userId && typeof userId === 'string') {

        comments = await prisma.comment.findMany({
            where: {
                userId
            },

            orderBy: {
                createdAt: 'desc'
            },
        });
    } else {
        comments = await prisma.comment.findMany({
            include: {
                user: true,
                // comments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    return NextResponse.json(comments);
}



export async function POST(req: Request, context) {
    // create comment

    const res = await req.json();
    const content = res.content;
    const postId = context.params.postId;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }

    if (!postId || typeof postId !== 'string') {
        throw new Error('Invalid ID');
    }

    const comment = await prisma.comment.create({
        data: {
            body: content,
            userId: currentUser.id,
            postId: postId,

        }
    });

    // NOTIFICATION PART START
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            }
        });

        if (post?.userId) {
            await prisma.notification.create({
                data: {
                    body: 'Someone replied on your tweet!',
                    userId: post.userId
                }
            });

            await prisma.user.update({
                where: {
                    id: post.userId
                },
                data: {
                    hasNotification: true
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    // NOTIFICATION PART END

    return NextResponse.json(comment);
}
