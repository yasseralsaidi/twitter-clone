import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";
import serverAuth from "@/libs/serverAuth";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function GET(req: Request, context) {
  // get comment

  // const postId = context.params.postId;
  const commentId = context.params.commentId;

  if (!commentId || typeof commentId !== 'string') {
    throw new Error('Invalid ID');
  }
  const comment = await prisma.comment.findUnique({
    where: {
      // postId: postId,
      id: commentId,
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(comment);
}


export async function PATCH(req: Request, context) {
  // update comment

  try {
    const body = await req.json();
    const commentData = body.commentData;
    const postId = commentData.postId;
    const commentId = commentData.id;

    const content = body.content;

    // const commentId = context.params.commentId;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }


    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    if (!postId) {
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

    return NextResponse.json({ message: 'Comment updated successfully' });

  }
  catch (error) {
    return NextResponse.json({ error: error.message });
  }
}


export async function DELETE(req: Request, context) {
  // delete comment

  try {
    const commentData = await req.json();
    const postId = commentData.postId;
    const commentId = commentData.id;

    // const postId = context.params.postId;
    // const postId = context.params.commentId;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }

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

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
