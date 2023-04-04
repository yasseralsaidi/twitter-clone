

import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { useSearchParams } from "next/navigation";
// import serverAuth from "@/libs/serverAuth";
// import getCurrentUser from '@/app/actions/getUser';


export async function GET(req: Request, context) {
  // get posts

  // const { userId } = req.query;
  const userId = context.params;

  let posts;

  if (userId && typeof userId === 'string') {
    posts = await prisma.post.findMany({
      where: {
        userId
      },
      include: {
        user: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
  } else {
    posts = await prisma.post.findMany({
      include: {
        user: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  return NextResponse.json(posts);
}


export async function POST(req: Request, context) {
  // create post

  const res = await req.json();
  const content = res.content;

  const currentUser = await getCurrentUser();
  if (!currentUser) { return NextResponse.error(); }

  const post = await prisma.post.create({
    data: {
      body: content,
      userId: currentUser.id
    }
  });
  return NextResponse.json(post);
}
