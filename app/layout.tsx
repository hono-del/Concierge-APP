import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { DemoSceneMenu } from "@/components/layout/DemoSceneMenu";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "コンシェルジュAPP",
  description:
    "Searchから Fitへ。回答から解決へ。ユーザー・車両・利用状況を理解し、必要な情報や次の行動を最適な形で届ける次世代の顧客接点デモ。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <DemoSceneMenu />
      </body>
    </html>
  );
}
