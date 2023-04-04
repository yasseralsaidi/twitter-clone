import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

  // const { userId } = req.query;
  const userId = params.userId;

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid ID');
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      hasNotification: false,
    }
  });

  return NextResponse.json(notifications);
}

