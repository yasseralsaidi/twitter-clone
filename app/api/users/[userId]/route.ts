import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {

  // const { userId } = req.query;
  const userId = params.userId;

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  const followersCount = await prisma.user.count({
    where: {
      followingIds: {
        has: userId
      }
    }
  })

  return NextResponse.json({ ...existingUser, followersCount });
}