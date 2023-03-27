import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const postData = JSON.parse(req.query.postData as string);
        const postId = postData.id;
        const { currentUser } = await serverAuth(req);


        if (!postId || typeof postId !== 'string') {
            throw new Error('Invalid ID');
        }

        if (!postId) {
            throw new Error('Comment not found');
        }

        if (postData.userId !== currentUser.id) {
            throw new Error('You are not authorized to delete this post');
        }

        await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}