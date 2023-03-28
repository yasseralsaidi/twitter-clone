
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.query;
    const { commentId } = req.query;

    if (!commentId || typeof commentId !== 'string') {
      throw new Error('Invalid ID');
    }
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId as string,
        id: commentId as string
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
