import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const comment = await prisma.comment.findUnique({
        where: {
            id: "64227df3bab14d461e799e4c",
        },
        include: {
            user: true,
        },
    });
    console.log(comment);
}