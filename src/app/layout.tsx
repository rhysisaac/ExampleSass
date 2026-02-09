import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "exampleSass",
  description: "Ship your SaaS fast with a reusable blueprint."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="topbar">
            <div className="topbarInner">
              <Link href="/" className="brand">
                exampleSass
              </Link>
              <nav className="topLinks" aria-label="Primary">
                <Link href="/pricing" className="navLink">
                  Pricing
                </Link>
                <Link href="/dashboard" className="navLink">
                  Dashboard
                </Link>
              </nav>
              <div className="authControls">
                <SignedOut>
                  <SignInButton mode="redirect">
                    <button className="ghostButton" type="button">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <button className="solidButton" type="button">
                      Get started
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
