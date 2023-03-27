import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const commentData = JSON.parse(req.query.commentData as string);
        const postId = commentData.postId;
        const commentId = commentData.id;
        const { currentUser } = await serverAuth(req);


        if (!commentId || typeof commentId !== 'string') {
            throw new Error('Invalid ID');
        }

        if (!commentId) {
            throw new Error('Comment not found');
        }

        if (commentData.userId !== currentUser.id) {
            throw new Error('You are not authorized to delete this comment');
        }

        await prisma.comment.delete({
            where: {
                id: commentId,
            },
        });

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}