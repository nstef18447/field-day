import type { Metadata } from "next";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Day — Keepsakes for Growing Up",
  description: "Handmade keepsakes for growing up — pennants, ribbons, badges, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barriecito&family=Nunito+Sans:ital,opsz,wght@0,6..12,300..700;1,6..12,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
