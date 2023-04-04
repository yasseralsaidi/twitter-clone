import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(req: Request, context) {


  const userId = context.params.userId;

  const currentUser = await getCurrentUser();
  if (!currentUser) { return NextResponse.error(); }

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid ID');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error('Invalid ID');
  }

  let updatedFollowingIds = [...(user.followingIds || [])];

  updatedFollowingIds.push(userId);

  // NOTIFICATION PART START
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (user?.id) {
      await prisma.notification.create({
        data: {
          body: 'Someone followed you!',
          userId: userId
        }
      });

      await prisma.user.update({
        where: {
          id: userId
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

  const updatedUser = await prisma.user.update({
    where: {
      id: currentUser?.id
    },
    data: {
      followingIds: updatedFollowingIds
    }
  });

  return NextResponse.json(updatedUser);

}


export async function DELETE(req: Request, context) {

  const userId = context.params.userId;

  const currentUser = await getCurrentUser();
  if (!currentUser) { return NextResponse.error(); }

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid ID');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error('Invalid ID');
  }

  let updatedFollowingIds = [...(user.followingIds || [])];

  updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== userId);

  const updatedUser = await prisma.user.update({
    where: {
      id: currentUser?.id
    },
    data: {
      followingIds: updatedFollowingIds
    }
  });

  return NextResponse.json(updatedUser);

}