import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';


export async function POST(req: Request, context) {

  try {

    const res = await req.json();
    const registerData = res.registerData;

    const hashedPassword = await bcrypt.hash(registerData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: registerData.email,
        username: registerData.username,
        name: registerData.name,
        hashedPassword: hashedPassword
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}