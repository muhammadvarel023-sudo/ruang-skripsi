import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, Archivo_Narrow, Yeseva_One } from "next/font/google";
import "./globals.css";

const yesevaOne = Yeseva_One({
  subsets: ["latin"],
  variable: "--font-yeseva",
  weight: ["400"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TelisikRiset: Pendampingan Skripsi Komunikasi Kualitatif",
  description:
    "Pendampingan akademik 1-on-1 untuk mahasiswa Ilmu Komunikasi Telkom University FKS dan PTS Bandung, dari penajaman Bab 1 hingga metodologi Bab 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${yesevaOne.variable} ${archivo.variable} ${archivoNarrow.variable}`}
    >
      <body className="bg-paper text-ink font-body antialiased">
        <a
          href="#main-content"
          className="fixed left-4 -top-24 z-[500] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform duration-200 focus:top-4"
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
