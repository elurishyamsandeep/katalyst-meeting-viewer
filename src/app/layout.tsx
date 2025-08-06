import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Katalyst AI - Meeting Viewer",
  description: "AI-powered meeting collaboration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
