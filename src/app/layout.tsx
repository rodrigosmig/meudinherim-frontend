import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased text-sm md:text-base text-white`}>
        <Toaster richColors closeButton position="top-right" />
        {children}
      </body>
    </html>
  );
}
