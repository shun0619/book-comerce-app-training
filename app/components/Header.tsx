// "use client"
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { nextAuthOptions } from "../lib/next-auth/options";
import { User } from "../types/types";

const Header = async () => {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  return (
    <header className="bg-gradient-to-b from-[#4A4031] to-[#2A241C] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href={"/"} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white font-serif">
              Book Commerce
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            <Link href="/" className="relative group px-4 py-2">
              <span className="relative z-10 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                ホーム
              </span>
              <div className="absolute inset-0 h-[2px] bg-[#8C7851] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 bottom-0" />
            </Link>

            <Link
              href={user ? "/profile" : "/api/auth/signin"}
              className="relative group px-4 py-2"
            >
              <span className="relative z-10 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                {user ? "プロフィール" : "ログイン"}
              </span>
              <div className="absolute inset-0 h-[2px] bg-[#8C7851] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 bottom-0" />
            </Link>

            {user && (
              <Link
                href={"/api/auth/signout"}
                className="relative group px-4 py-2"
              >
                <span className="relative z-10 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm">
                  ログアウト
                </span>
                <div className="absolute inset-0 h-[2px] bg-[#8C7851] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 bottom-0" />
              </Link>
            )}
            {user && (
              <Link href={`/profile`} className="relative group ml-2">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#8C7851] ring-offset-2 ring-offset-[#2A241C] transition-all duration-200 group-hover:ring-[#B59B6D]">
                  <Image
                    width={40}
                    height={40}
                    alt="profile_icon"
                    src={user?.image || "/default_icon.png"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#2A241C] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#8C7851]">
                  {user ? "プロフィール" : "ログイン"}
                </div>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
