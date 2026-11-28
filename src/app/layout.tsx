import type { Metadata } from "next";
import Script from "next/script";
import { Gabarito, Manrope } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
  weight: ["700", "800"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TelisikRiset: Pendampingan Skripsi Komunikasi Kualitatif",
  description:
    "Mentoring 1-on-1 skripsi Ilmu Komunikasi untuk Telkom University FKS dan PTS Bandung, terstruktur dari Bab 1 sampai Bab 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${gabarito.variable} ${manrope.variable}`}
    >
      <body className="bg-paper text-ink font-body antialiased">
        <a
          href="#main-content"
          className="fixed left-4 -top-24 z-[500] rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition-transform duration-200 focus:top-4"
        >
          Lewati ke konten utama
        </a>
        {children}
        <Script id="hallmark-slots" strategy="afterInteractive">
          {`document.documentElement.classList.add('js');
window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector('[data-slot="' + k + '"]'); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
document.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });`}
        </Script>
      </body>
    </html>
  );
}
