import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ paddingBottom: 70 }}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
