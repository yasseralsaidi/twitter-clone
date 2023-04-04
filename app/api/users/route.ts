import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return NextResponse.json(users);
}