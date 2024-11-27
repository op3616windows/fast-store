import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MenuIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";

import { Link } from "@/components/ui/link";
import { Cart } from "@/components/cart";
import { SearchDropdown } from "@/components/search-dropdown";
import { WelcomeToast } from "./welcome-toast";
import { AuthServer } from "./auth.server";

export const metadata: Metadata = {
  title: {
    template: "%s | NextFaster",
    default: "NextFaster",
  },
  description: "A performant site built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex flex-col antialiased`}
      >
        <div>
          <header className="z-10 flex flex-grow items-center justify-between gap-4 border-b-2 border-accent2 bg-background p-2 pb-[4px] sm:flex-row sm:p-4 sm:pb-[4px] sm:pt-0">
            <div className="flex flex-grow flex-col">
              <div className="absolute right-2 top-2 flex justify-end pt-2 font-sans text-sm hover:underline sm:relative sm:right-0 sm:top-0">
                <Suspense
                  fallback={
                    <button className="flex flex-row items-center gap-1">
                      <div className="h-[20px]" />
                      <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
                        <polygon points="0,0 5,6 10,0"></polygon>
                      </svg>
                    </button>
                  }
                >
                  <AuthServer />
                </Suspense>
              </div>
              <div className="flex w-full flex-col items-start justify-center gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  prefetch={true}
                  href="/"
                  className="text-4xl font-bold text-accent1"
                >
                  FastStore
                </Link>
                <div className="flex items-center justify-between flex-row w-full gap-4">
                  <div className="mx-0 flex-grow sm:mx-auto sm:flex-grow-0">
                    <SearchDropdown />
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="relative">
                      <Link
                        prefetch={true}
                        href="/order"
                        className="text-lg text-accent1 uppercase hover:underline"
                      >
                        ORDER
                      </Link>
                      <Suspense>
                        <Cart />
                      </Suspense>
                    </div>
                    <Link
                      prefetch={true}
                      href="/order-history"
                      className="hidden text-lg text-accent1 uppercase hover:underline md:block"
                    >
                      ORDER HISTORY
                    </Link>
                    <Link
                      href="/order-history"
                      className="block text-lg text-accent1 hover:underline md:hidden"
                    >
                      <MenuIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {children}
        </div>
        <footer className="flex h-[8px] flex-col items-center justify-between space-y-2 border-t border-gray-400 bg-background px-4 font-sans text-[11px] sm:h-6 sm:flex-row sm:space-y-0">
          <div className="flex flex-wrap justify-center space-x-2 py-2 sm:justify-start">
            <span className="hover:bg-accent2 hover:underline">Home</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">FAQ</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Returns</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Careers</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Contact</span>
          </div>
          <div className="text-center sm:text-right">
            By using this website, you agree to check out the{" "}
            <Link
              href="https://github.com/op3616"
              className="font-bold text-accent1 hover:underline"
              target="_blank"
            >
              @op3616
            </Link>
          </div>
        </footer>
        <Suspense fallback={null}>
          <Toaster closeButton />
          <WelcomeToast />
        </Suspense>
        {/* TODO: Add analytics */}
      </body>
    </html>
  );
}
