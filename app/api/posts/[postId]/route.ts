import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";
import serverAuth from "@/libs/serverAuth";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function GET(req: Request, context) {
  // get post

  // const { postId } = req.query;
  const postId = context.params.postId;

  if (!postId || typeof postId !== 'string') {
    throw new Error('Invalid ID');
  }


  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: true,
      comments: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
    },
  });

  return NextResponse.json(post);
}


export async function PATCH(req: Request, context) {
  // update post

  try {
    const body = await req.json();
    const postData = body.postData;
    const postId = postData.id;

    const content = body.content;

    // const postId = context.params.postId;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }


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

    return NextResponse.json({ message: 'Post updated successfully' });

  }
  catch (error) {
    return
    // throw error;
    NextResponse.json({ error: error.message });
  }
}


export async function DELETE(req: Request, context) {
  // delete post

  try {

    const postData = await req.json();
    const postId = postData.id;
    // const postId = context.params.postId;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    if (!postId) {
      throw new Error('Post not found');
    }

    if (postData.userId !== currentUser.id) {
      throw new Error('You are not authorized to delete this post');
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}