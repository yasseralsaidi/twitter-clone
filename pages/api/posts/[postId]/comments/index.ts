import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { currentUser } = await serverAuth(req);
  const { body } = req.body;
  const { postId } = req.query;

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {

    if (req.method === 'POST') {


      const comment = await prisma.comment.create({
        data: {
          body,
          postId: postId as string,
          userId: currentUser.id
        }
      });

      return res.status(200).json(comment);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;

      // console.log({ userId })

      let comments;

      if (userId && typeof userId === 'string') {

        comments = await prisma.comment.findMany({
          where: {
            userId

            //  postId as string
          },
          // include: {
          //   user: true,
          //   comments: true
          // },
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

      return res.status(200).json(comments);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}