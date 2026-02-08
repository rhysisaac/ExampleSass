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
            <Link href="/" className="brand">
              exampleSass
            </Link>
            <div className="authControls">
              <SignedOut>
                <SignInButton mode="redirect">
                  <button className="ghostButton" type="button">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button className="ghostButton" type="button">
                    Sign up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
