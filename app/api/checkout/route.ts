import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {

  
  const { title, price, bookId, userId, imgUrl } = await request.json();
  console.log(title, price);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        bookId: bookId,
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
              images: [imgUrl],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000",
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (err: unknown) { // 型をunknownに指定
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message });
    }
    // エラーがオブジェクトや文字列である場合に備える
    return NextResponse.json({ message: String(err) });
  }
}