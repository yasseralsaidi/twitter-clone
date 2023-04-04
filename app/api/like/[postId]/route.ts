import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(req: Request, context) {

  const res = await req.json();
  const postId = res.id;
  // const { postId } = context.params;

  const currentUser = await getCurrentUser();
  if (!currentUser) { return NextResponse.error(); }


  if (!postId || typeof postId !== 'string') {
    throw new Error('Invalid ID');
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if (!post) {
    throw new Error('Invalid ID');
  }

  let updatedLikedIds = [...(post.likedIds || [])];

  updatedLikedIds.push(currentUser?.id);

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
          body: 'Someone liked your tweet!',
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
  } catch (error) {
    console.log(error);
  }
  // NOTIFICATION PART END

  const updatedPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      likedIds: updatedLikedIds
    }
  });

  return NextResponse.json(updatedPost);

}


export async function DELETE(req: Request, context) {

  const res = await req.json();
  const postId = res.id;
  // const { postId } = context.params;

  const currentUser = await getCurrentUser();
  if (!currentUser) { return NextResponse.error(); }


  if (!postId || typeof postId !== 'string') {
    throw new Error('Invalid ID');
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if (!post) {
    throw new Error('Invalid ID');
  }

  let updatedLikedIds = [...(post.likedIds || [])];

  updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser?.id);

  const updatedPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      likedIds: updatedLikedIds
    }
  });

  return NextResponse.json(updatedPost);

}