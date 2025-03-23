import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {

  const { contents } = await getAllBooks();
  const session = await getServerSession(nextAuthOptions);

  // as 存在しているときのみ型を割り当てる
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`);
    const purchasesData = await response.json();

    purchaseBookIds = purchasesData?.map(
      (purchaseBook: Purchase) => purchaseBook.bookId);
  }


  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[#F7F3EE] via-[#F0EBE4] to-[#E8E1D9]">
        <div className="container mx-auto px-4 py-8">
          <div className="relative text-center mb-16">
            <h1 className="text-4xl font-bold text-[#4A4031] mb-4 font-serif relative z-10">
              Book Commerce
            </h1>
            <p className="text-[#6B5D4D] text-lg font-medium relative z-10">
              あなたの次の一冊を見つけましょう
            </p>
            {/* 和風の装飾パターン */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* 背景の装飾パターン */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
            
            {contents?.map((book: BookType) => (
              <Book key={book.id}
                book={book}
                isPurchased={purchaseBookIds.includes(book.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}