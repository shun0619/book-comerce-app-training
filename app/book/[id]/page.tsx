import { getDetailBook } from "@/app/lib/microcms/client";
import { BookType } from "@/app/types/types";
import Image from "next/image";
import React from "react";

const DetailBook = async ({ params }: { params: Promise<{ id: string }> } ) => {
  
  // asynchronous access of `params.id`.
  const id = (await params).id 
  const book: BookType = await getDetailBook(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F3EE] via-[#F0EBE4] to-[#E8E1D9]">
      <div className="container mx-auto px-4 py-12">
        <div className="relative">
          {/* 背景の装飾パターン */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-[#E8E1D9] relative z-10">
            <div className="relative bg-[#F7F3EE]">
              <Image
                src={book.thumbnail.url}
                alt={book.title}
                className="w-full h-[500px] object-contain"
                width={500}
                height={500}
                priority
              />
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-[#4A4031] mb-6 font-serif">{book.title}</h2>
              <div
                className="prose prose-lg max-w-none text-[#6B5D4D] mb-8 prose-headings:font-serif prose-headings:text-[#4A4031]"
                dangerouslySetInnerHTML={{ __html: book.content }}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-[#8C7851] border-t border-[#E8E1D9] pt-6">
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    公開日: {new Date(book.publishedAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    最終更新: {new Date(book.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBook;