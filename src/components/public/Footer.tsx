import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  return (
    <footer className="border-t border-rule bg-paper-3 py-14 text-ink-2">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 border-b border-rule pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo size={38} />
              <p className="font-display text-3xl text-ink sm:text-4xl">
                {brandName}
              </p>
            </div>
            <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink-2">
              Mentoring 1-on-1 skripsi Ilmu Komunikasi kualitatif, modular per bab.
            </p>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap items-center gap-5 text-sm font-bold text-ink"
          >
            <a
              href="#peta-riset"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              Bagan Riset
            </a>
            <a
              href="#layanan"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              Paket
            </a>
            <a
              href="#eksplorasi"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              Metode
            </a>
            <a
              href="#cara-kerja"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              Alur
            </a>
            <a
              href="#prinsip"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              Etika
            </a>
            <a
              href="#faq"
              className="whitespace-nowrap transition-colors duration-200 hover:text-accent"
            >
              FAQ
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-rule bg-paper-2 px-4 py-2 text-sm font-bold text-ink transition-colors duration-200 hover:border-accent hover:text-accent whitespace-nowrap"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Admin
            </Link>
          </nav>
        </div>

        <p
          data-credits=""
          className="mt-6 text-xs leading-relaxed text-muted"
        >
          Photographs:{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Statsbiblioteket_l%C3%A6sesalen-2.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Villy Fink Isaksen
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Fountain_pen_writing_(literacy).jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Petar Milošević
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Interior_of_the_Paperback_Bookshop_May_2023.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Nick-D
          </a>{" "}
          (CC BY-SA 4.0),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Salle_de_lecture_Bibliotheque_Sainte-Genevieve_n03.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Marie-Lan Nguyen
          </a>{" "}
          (CC BY 2.0 fr),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Writing_in_a_notebook_with_a_feather_pen_while_enjoying_coffee_at_a_desk_surrounded_by_flowers.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Shixart1985
          </a>{" "}
          (CC BY 2.0, Wikimedia Commons).
        </p>
      </div>
    </footer>
  );
}
