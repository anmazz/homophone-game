import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Homophone!",
  description: "It's always the other one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Homophone Game!"/>
        <link rel="icon" href="/favicon.ico"/>
      </head>
      <body className="flex-1">
        {children}
      </body>
    </html>
  );
}
