import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import Link from "next/link";

export default async function ProfilePage() {

  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchasesDetailBooks: BookType[] = [];

  if (user) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`);
    const purchasesData = await response.json();


    purchasesDetailBooks = await Promise.all(
      purchasesData.map(async (purchase: Purchase) => {
        return await getDetailBook(purchase.bookId);
      })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F3EE] via-[#F0EBE4] to-[#E8E1D9]">
      <div className="container mx-auto px-4 py-12">
        <div className="relative">
          {/* 背景の装飾パターン */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-[#E8E1D9] relative z-10">
            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#8C7851] ring-offset-4 ring-offset-[#F7F3EE] mb-4">
                  <Image
                    width={128}
                    height={128}
                    alt="profile_icon"
                    src={user.image || "/default_icon.png"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="text-2xl font-bold text-[#4A4031] font-serif">{user.name}</h1>
                <p className="text-[#6B5D4D] mt-2">{user.email}</p>
              </div>

              <div className="border-t border-[#E8E1D9] pt-8">
                <h2 className="text-xl font-bold text-[#4A4031] mb-6 font-serif flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#8C7851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  購入した本
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {purchasesDetailBooks.map((book: BookType) => (
                    <Link href={`/book/${book.id}`} key={book.id}>
                      <div className="bg-[#F7F3EE] rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                        <div className="relative w-full pt-[100%] mb-3">
                          <div className="absolute inset-0 rounded-md overflow-hidden bg-white">
                            <Image
                              src={book.thumbnail.url}
                              alt={book.title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              className="object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        </div>
                        <h3 className="font-medium text-[#4A4031] text-sm line-clamp-2 group-hover:text-[#8C7851] transition-colors duration-200">
                          {book.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}