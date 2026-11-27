import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RuangSkripsi — Platform Konsultasi & Brainstorming Skripsi Terstruktur",
  description:
    "Pendampingan akademik, brainstorming topik, pemetaan teori, dan evaluasi metodologi skripsi dengan pilihan paket fleksibel dan harga transparan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-[#F8FAFC] text-[#090E1A] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
        {children}
      </body>
    </html>
  );
}
