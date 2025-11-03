import "./globals.css";
import type { Metadata } from "next";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Devon Selvaggi",
  description: "Founder / Operator portfolio and blog",
  metadataBase: new URL("https://www.devonselvaggi.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="container-narrow py-10 relative">{children}</div>
        <ScrollToTop />
      </body>
    </html>
  );
}
