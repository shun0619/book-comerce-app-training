import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

//　購入履歴の保存
export async function POST(request: Request) {
  const { sessionId } = await request.json();

  try {

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const client_reference_id = session.client_reference_id ?? "";
    const bookId = session.metadata?.bookId ?? "";

    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: client_reference_id,
        bookId: bookId,
      },
    });

    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: client_reference_id,
          bookId: bookId,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      return NextResponse.json({ message: "すでに購入済みです。" })
    }
  } catch (err: unknown) { // 型をunknownに指定
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message });
    }
    // エラーがオブジェクトや文字列である場合に備える
    return NextResponse.json({ message: String(err) });
  }
}