import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const content = req.body.content;
        const postData = req.body.currentPostData;
        const postId = postData.id;
        const { currentUser } = await serverAuth(req);

        console.log(content);

        if (!postId || typeof postId !== 'string') {
            throw new Error('Invalid ID');
        }

        if (!postId) {
            throw new Error('Post not found');
        }

        if (postData.userId !== currentUser.id) {
            throw new Error('You are not authorized to update this post');
        }

        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                body: content,
            }
        });


        return res.status(200).json({ message: 'post updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }

}