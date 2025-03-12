import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  // paramsをそのまま使用（awaitを削除）
  const { userId } = params;

  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json(purchases);
  } catch (err) {
    // エラーを安全に処理
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}