"use client";
import { SessionProvider } from "next-auth/react";

export default function NextAuthSession({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
/// Supported Pattern: Passing Server Components to Client Components as Props
