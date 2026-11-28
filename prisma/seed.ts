import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default settings (idempotent: never overwrite admin edits)
  const defaultSettings = [
    { key: "brand_name", value: "TelisikRiset" },
    { key: "admin_telegram", value: "telisikriset" },
    { key: "admin_line", value: "telisikriset" },
    { key: "non_telkom_surcharge", value: "50000" },
    { key: "addon_session_price", value: "60000" },
    { key: "qris_image_url", value: "" },
    { key: "qris_merchant_name", value: "" },
    { key: "bank_name", value: "BCA / SeaBank / DANA (Atur di Admin)" },
    { key: "bank_account_number", value: "Atur di Dashboard Admin" },
    { key: "bank_account_holder", value: "TelisikRiset" },
    {
      key: "wa_template",
      value:
        "Halo Admin TelisikRiset, saya ingin konfirmasi & kirim bukti pembayaran konsultasi skripsi (Komunikasi — Kualitatif):\n\nKode Pesanan: {{orderCode}}\nNama: {{studentName}}\nAsal Kampus: {{campusName}}\nProdi: {{major}}\nPaket: {{categoryName}} — {{packageName}}\nTotal Paket: {{price}}\nSkema Bayar: {{paymentPlan}} ({{amountDueNow}})\nPendekatan Kualitatif: {{researchType}}\nTopik/Judul: {{topicOrTitle}}\n\nBerikut saya lampirkan bukti transfernya. Mohon info jadwal sesinya ya!",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Categories
  const bab1 = await prisma.category.upsert({
    where: { slug: "bab-1-pendahuluan" },
    update: {},
    create: {
      name: "BAB 1. Pendahuluan",
      shortLabel: "Bab 1",
      slug: "bab-1-pendahuluan",
      description:
        "Fondasi penelitian kualitatif Ilmu Komunikasi—mulai dari mematangkan fenomena komunikasi, menyiapkan 2 opsi judul & rumusan masalah, hingga menyusun Bab 1 utuh.",
      sortOrder: 1,
      isActive: true,
    },
  });

  const bab2 = await prisma.category.upsert({
    where: { slug: "bab-2-tinjauan-pustaka" },
    update: {},
    create: {
      name: "BAB 2. Tinjauan Pustaka",
      shortLabel: "Bab 2",
      slug: "bab-2-tinjauan-pustaka",
      description:
        "Memperkuat pijakan ilmiah melalui pemetaan teori komunikasi & sosial, sintesis penelitian terdahulu, identifikasi research gap, dan kerangka pemikiran kualitatif.",
      sortOrder: 2,
      isActive: true,
    },
  });

  const bab3 = await prisma.category.upsert({
    where: { slug: "bab-3-metodologi-penelitian" },
    update: {},
    create: {
      name: "BAB 3. Metodologi Penelitian",
      shortLabel: "Bab 3",
      slug: "bab-3-metodologi-penelitian",
      description:
        "Merancang dan mengevaluasi metodologi penelitian kualitatif komunikasi—mulai dari paradigma, tradisi (studi kasus, fenomenologi, semiotika, wacana, etnografi), informan, hingga keabsahan data.",
      sortOrder: 3,
      isActive: true,
    },
  });

  // Only seed packages if database has 0 packages (so admin edits/deletions stay untouched)
  const existingPackages = await prisma.package.count();
  if (existingPackages === 0) {
    const packagesData = [
      // BAB 1 (2 concrete, high-value packages matching poster!)
      {
        categoryId: bab1.id,
        name: "Pondasi Judul & Rumusan Masalah",
        slug: "bab-1-pondasi-judul-rumusan",
        badge: "Tahap Awal",
        shortDescription:
          "Brainstorming fenomena komunikasi hingga kamu pulang membawa 2 opsi judul kualitatif, fokus masalah, dan Mini Outline 1 halaman siap pengajuan ACC dosen.",
        studentCondition:
          "Masih bingung topik/judul atau sudah punya ide dasar dan butuh pegangan konkret buat pengajuan ACC ke dosen pembimbing.",
        outputs: JSON.stringify([
          "Brainstorming fenomena komunikasi sesuai konsentrasi prodi",
          "2 opsi judul kualitatif yang tajam (ada cadangan!)",
          "Pemetaan fokus & rumusan masalah kualitatif",
          "Bonus Mini Outline 1 halaman siap dibawa ke dosen",
          "Bonus 1x follow-up evaluasi ringan via chat setelah bimbingan",
        ]),
        price: 139000,
        discountPrice: null,
        durationLabel: "1x Sesi Diskusi (60–90 Menit)",
        isFeatured: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: bab1.id,
        name: "Pendahuluan Terstruktur (Full Bab 1)",
        slug: "bab-1-pendahuluan-terstruktur",
        badge: "Paling Lengkap",
        shortDescription:
          "Pendampingan menyeluruh menyusun alur logika Bab 1—dari latar belakang & arah data pendukung, fokus masalah, tujuan, hingga manfaat penelitian—sampai draft solid.",
        studentCondition:
          "Ingin dibimbing menyusun kerangka & alur Bab 1 secara utuh, runtut, dan argumentatif agar siap maju bimbingan.",
        outputs: JSON.stringify([
          "Evaluasi judul & penajaman alur argumen latar belakang",
          "Rekomendasi arah data & fenomena pendukung",
          "Penyusunan fokus, rumusan masalah, tujuan, & manfaat",
          "Review & evaluasi koherensi struktur draft Bab 1",
          "Bonus 1x follow-up revisi ringan via chat (14 hari)",
        ]),
        price: 249000,
        discountPrice: null,
        durationLabel: "2x Sesi Pendampingan + Review Draft",
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      },

      // BAB 2
      {
        categoryId: bab2.id,
        name: "Basic Research Framework",
        slug: "bab-2-basic-research-framework",
        badge: "Review & Evaluasi",
        shortDescription:
          "Audit mendalam atas teori komunikasi, penelitian terdahulu, dan kerangka pemikiran yang sudah kamu susun agar tidak ada celah logika.",
        studentCondition:
          "Sudah memiliki landasan teori komunikasi, penelitian terdahulu, dan kerangka pemikiran, namun butuh validasi akademik.",
        outputs: JSON.stringify([
          "Review ketepatan teori komunikasi & konsep pendukung",
          "Evaluasi relevansi dan keterbaruan penelitian terdahulu",
          "Review alur logika bagan kerangka pemikiran",
          "Konsultasi relevansi teori dengan fokus masalah kualitatif",
          "Evaluasi keterhubungan antarkonsep dalam penelitian",
        ]),
        price: 250000,
        discountPrice: null,
        durationLabel: "1x Sesi Review + Catatan Evaluasi",
        isFeatured: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: bab2.id,
        name: "Theory Development",
        slug: "bab-2-theory-development",
        badge: "Paling Populer",
        shortDescription:
          "Mengembangkan konsep pendukung, memetakan matriks penelitian terdahulu, menemukan research gap, dan merangkai kerangka pemikiran kualitatif.",
        studentCondition:
          "Sudah memiliki grand theory komunikasi dan teori pendukung, tetapi belum memiliki penelitian terdahulu yang terstruktur dan kerangka pemikiran.",
        outputs: JSON.stringify([
          "Evaluasi kesesuaian grand theory komunikasi",
          "Pengembangan & penajaman konsep pendukung",
          "Pencarian dan pemetaan matriks penelitian terdahulu",
          "Identifikasi research gap yang tajam",
          "Pengembangan bagan & narasi kerangka pemikiran",
          "Konsultasi hubungan teori dengan fokus penelitian",
        ]),
        price: 375000,
        discountPrice: null,
        durationLabel: "2x Sesi Diskusi + Pemetaan Literatur",
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      },
      {
        categoryId: bab2.id,
        name: "Comprehensive Literature Research",
        slug: "bab-2-comprehensive-literature-research",
        badge: "Pendampingan Penuh",
        shortDescription:
          "Pendampingan paling komprehensif untuk membangun Bab 2 dari nol—mulai dari pemetaan konsep komunikasi, pemilihan teori, literatur jurnal, hingga kerangka penelitian.",
        studentCondition:
          "Belum memiliki landasan teori komunikasi, referensi jurnal akademik, maupun kerangka pemikiran yang terstruktur.",
        outputs: JSON.stringify([
          "Brainstorming dan pemetaan konsep penelitian komunikasi",
          "Identifikasi teori utama (grand theory) yang paling relevan",
          "Rekomendasi teori & konsep pendukung yang kredibel",
          "Pemetaan literatur dan penelitian terdahulu",
          "Identifikasi research gap secara jelas",
          "Pengembangan kerangka pemikiran menyeluruh",
          "Rekomendasi sumber referensi buku & jurnal komunikasi",
          "Konsultasi pengembangan Bab 2 secara bertahap",
        ]),
        price: 525000,
        discountPrice: null,
        durationLabel: "3x Sesi Bertahap + Kurasi Referensi",
        isFeatured: false,
        isActive: true,
        sortOrder: 3,
      },

      // BAB 3
      {
        categoryId: bab3.id,
        name: "Qualitative Methodology Review",
        slug: "bab-3-methodology-review",
        badge: "Audit Metode",
        shortDescription:
          "Evaluasi menyeluruh terhadap rancangan metodologi kualitatifmu—memastikan paradigma, tradisi, teknik pengumpulan, dan keabsahan data selaras dengan rumusan masalah.",
        studentCondition:
          "Sudah memiliki draft Bab 3 kualitatif dan ingin memastikan tidak ada ketidaksinkronan antara paradigma, metode, dan teknik analisis.",
        outputs: JSON.stringify([
          "Review paradigma & pendekatan kualitatif (konstruktivis, kritis, interpretif)",
          "Review tradisi penelitian (studi kasus, fenomenologi, semiotika, wacana, etnografi)",
          "Review teknik pengumpulan data (wawancara mendalam, observasi, dokumentasi)",
          "Review teknik analisis data & uji keabsahan/triangulasi data",
          "Evaluasi keselarasan metodologi dengan rumusan masalah Bab 1",
        ]),
        price: 250000,
        discountPrice: null,
        durationLabel: "1x Sesi Review + Catatan Perbaikan",
        isFeatured: false,
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: bab3.id,
        name: "Qualitative Methodology Development",
        slug: "bab-3-methodology-development",
        badge: "Paling Populer",
        shortDescription:
          "Pendampingan merancang Bab 3 kualitatif dari awal—menentukan paradigma, jenis metode kualitatif, kriteria informan/unit analisis, hingga alur analisis data.",
        studentCondition:
          "Masih bingung menentukan paradigma, tradisi kualitatif, kriteria informan, atau teknik analisis data yang paling pas untuk topik komunikasimu.",
        outputs: JSON.stringify([
          "Diskusi penentuan paradigma & tradisi kualitatif yang tepat",
          "Pengembangan desain penelitian kualitatif secara terstruktur",
          "Penentuan teknik pengumpulan data & kisi-kisi panduan wawancara/observasi",
          "Pengembangan alur teknik analisis data & strategi keabsahan (triangulasi)",
          "Rekomendasi kriteria informan kunci, objek, atau unit analisis",
          "Konsultasi keselarasan metodologi dengan Bab 1 dan Bab 2",
        ]),
        price: 400000,
        discountPrice: null,
        durationLabel: "2x Sesi Intensif + Blueprint Metode",
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      },
    ];

    for (const pkg of packagesData) {
      await prisma.package.create({ data: pkg });
    }
  }

  console.log("Seed TelisikRiset selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
