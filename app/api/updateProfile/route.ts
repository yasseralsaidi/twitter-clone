import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, context) {

  try {

    // const { name, username, bio, profileImage, coverImage } = req.body;

    const res = await req.json();
    const profileData = res.profileData;

    const currentUser = await getCurrentUser();
    if (!currentUser) { return NextResponse.error(); }

    if (!profileData.name || !profileData.username) {
      throw new Error('Missing fields');
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
        coverImage: profileData.coverImage,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}