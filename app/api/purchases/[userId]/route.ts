import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  const { userId } = params; // コンテキストからparamsを取得

  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json(purchases);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}