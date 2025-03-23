"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
}

// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased }: BookProps) => {

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'confirm' | 'purchased' | null>(null);
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            userId: user?.id,
            bookId: book.id,
            imgUrl: book.thumbnail.url,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handlePurchaseClick = () => {
    if (isPurchased) {
      setModalType('purchased');
      setShowModal(true);
    } else {
      setModalType('confirm');
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push("/api/auth/signin");
    } else {
      startCheckout();
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a onClick={handlePurchaseClick}
          className="cursor-pointer bg-[#FBF7F4] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-[400px] border border-[#E8E1D9]">
          <div className="relative">
            <Image
              priority
              src={book.thumbnail.url}
              alt={book.title}
              width={400}
              height={400}
              className="w-[400px] h-[400px] object-cover"
            />
            {isPurchased && (
              <div className="absolute top-4 right-4 bg-[#8C7851] text-white px-3 py-1 rounded-full text-sm font-medium">
                購入済み
              </div>
            )}
          </div>
          <div className="p-6 border-t border-[#E8E1D9]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#4A4031] mb-2 line-clamp-2 font-serif">{book.title}</h2>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-[#8C7851] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-2xl font-bold text-[#8C7851] font-serif">¥{book.price}</span>
              </div>
            </div>
            <p className="text-[#6B5D4D] mb-4 line-clamp-2 text-sm">この本は○○...</p>
            <div className="flex justify-end">
              <button className="bg-[#8C7851] hover:bg-[#6B5D4D] text-white px-6 py-2 rounded-full text-sm transition-colors duration-200 flex items-center">
                <span>購入する</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </a>
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 modal">
            <div className="bg-[#F7F3EE] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-[#E8E1D9] relative">
              {/* 和風の装飾パターン */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#8C7851] opacity-5 rounded-full blur-3xl"></div>

              <div className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className={`absolute inset-0 bg-[#8C7851] opacity-10 rounded-full ${modalType === 'purchased' ? 'animate-ping' : ''}`}></div>
                  <div className="relative bg-[#F7F3EE] rounded-full p-4 border-2 border-[#8C7851]">
                    <svg className="w-12 h-12 text-[#8C7851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {modalType === 'purchased' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                    </svg>
                  </div>
                </div>
                {modalType === 'purchased' ? (
                  <>
                    <h3 className="text-2xl font-bold text-[#4A4031] mb-3 font-serif">ご購入済みの商品です</h3>
                    <p className="text-[#6B5D4D] mb-6 text-sm">この商品は既にお買い求めいただいております。</p>
                    <button
                      onClick={handleCancel}
                      className="bg-[#8C7851] hover:bg-[#6B5D4D] text-white font-medium py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg"
                    >
                      閉じる
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#4A4031] mb-3 font-serif">ご購入の確認</h3>
                    <p className="text-[#6B5D4D] mb-6 text-sm">この商品をお買い求めになりますか？</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handlePurchaseConfirm}
                        className="bg-[#8C7851] hover:bg-[#6B5D4D] text-white font-medium py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg"
                      >
                        購入する
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-[#E8E1D9] hover:bg-[#D9CFC4] text-[#4A4031] font-medium py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg"
                      >
                        キャンセル
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;