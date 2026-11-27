import { execSync } from "child_process";

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

run("npx prisma generate");

if (process.env.DATABASE_URL) {
  console.log("\nDATABASE_URL terdeteksi — sinkronisasi tabel & seed awal...");
  run("npx prisma db push --skip-generate");
  run("npx tsx prisma/seed.ts");
} else {
  console.log(
    "\nPERINGATAN: DATABASE_URL belum disetel. Melewati prisma db push & seed."
  );
}

run("npx next build");
