"use client";

import { SessionProvider } from "next-auth/react";
import{PropsWithChildren, FC} from "react";

export const NextAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
};