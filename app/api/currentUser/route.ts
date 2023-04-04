import { NextResponse } from "next/server";
import getCurrentUser from "../../actions/getCurrentUser";


export async function GET(req: Request) {

  try {
    const currentUser = await getCurrentUser()

    return NextResponse.json(currentUser);

  } catch (error) {
    console.log(error)
    throw new Error('Error getting current user')
  }
}
