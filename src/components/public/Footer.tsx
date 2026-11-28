import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  return (
    <footer className="band-ink border-t border-paper/15 py-16 text-paper/85">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 border-b border-paper/15 pb-10 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo size={38} variant="light" />
              <p className="font-display text-3xl text-paper sm:text-4xl">
                {brandName}
              </p>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">
              Platform pendampingan, brainstorming, dan evaluasi metodologi penelitian
              skripsi Ilmu Komunikasi kualitatif secara terstruktur dan transparan.
            </p>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap items-center gap-6 text-sm font-medium text-paper/85"
          >
            <a
              href="#layanan"
              className="whitespace-nowrap transition-colors duration-200 hover:text-gold-2"
            >
              Katalog Paket
            </a>
            <a
              href="#eksplorasi"
              className="whitespace-nowrap transition-colors duration-200 hover:text-gold-2"
            >
              Jelajah Bab
            </a>
            <a
              href="#cara-kerja"
              className="whitespace-nowrap transition-colors duration-200 hover:text-gold-2"
            >
              Alur Sesi
            </a>
            <a
              href="#faq"
              className="whitespace-nowrap transition-colors duration-200 hover:text-gold-2"
            >
              FAQ
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-2 text-sm font-semibold text-paper transition-colors duration-200 hover:border-gold-2 hover:text-gold-2 whitespace-nowrap"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Dashboard Admin
            </Link>
          </nav>
        </div>

        <p
          data-credits=""
          className="mt-6 text-xs leading-relaxed text-paper/65"
        >
          Photographs:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Statsbiblioteket_l%C3%A6sesalen-2.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            Villy Fink Isaksen
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Fountain_pen_writing_(literacy).jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            Petar Milošević
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Interior_of_the_Paperback_Bookshop_May_2023.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            Nick-D
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            Marie-Lan Nguyen
          </a>{" "}
          (CC BY 2.0 fr),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            Shixart1985
          </a>{" "}
          (CC BY 2.0, Wikimedia Commons).
        </p>
      </div>
    </footer>
  );
}
