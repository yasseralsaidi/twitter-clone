import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const content = req.body.content;
        const commentData = req.body.currentCommentData;
        const postId = commentData.postId;
        const commentId = commentData.id;
        const { currentUser } = await serverAuth(req);

        console.log(content);

        if (!commentId || typeof commentId !== 'string') {
            throw new Error('Invalid ID');
        }

        if (!commentId) {
            throw new Error('Comment not found');
        }

        if (commentData.userId !== currentUser.id) {
            throw new Error('You are not authorized to update this comment');
        }

        await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                body: content,
            }
        });


        return res.status(200).json({ message: 'comment updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }

}