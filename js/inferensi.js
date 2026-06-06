function prosesInferensi(muSuhu, muKelembapan, muIntensitas) {

  const { aturanFuzzy } = fuzzyLogic();

  const hasilPerRule = aturanFuzzy.map(rule => {
    const nilaiSuhu       = muSuhu[rule.suhu];
    const nilaiKelembapan = muKelembapan[rule.kelembapan];
    const nilaiIntensitas = muIntensitas[rule.intensitas];
    const alpha           = Math.min(nilaiSuhu, nilaiKelembapan, nilaiIntensitas);

    return {
      rule            : rule.r,
      suhu            : rule.suhu,
      kelembapan      : rule.kelembapan,
      intensitas      : rule.intensitas,
      output          : rule.output,
      nilaiSuhu,
      nilaiKelembapan,
      nilaiIntensitas,
      alpha,
      aktif           : alpha > 0,
    };
  });

  const agreagatOutput = { sebentar: 0, sedang: 0, lama: 0 };

  hasilPerRule.forEach(r => {
    if (r.alpha > agreagatOutput[r.output]) {
      agreagatOutput[r.output] = r.alpha;
    }
  });

  return { hasilPerRule, agreagatOutput };
}


function tampilHasilInferensi(hasilPerRule, agreagatOutput) {

  console.log("=== HASIL INFERENSI (Mamdani) ===");
  console.log("Rule  | μSuhu | μKelembapan | μIntensitas | α=MIN  | Output    | Status");
  console.log("------|-------|-------------|-------------|--------|-----------|-------");

  hasilPerRule.forEach(r => {
    const status = r.aktif ? "✓ AKTIF" : "- tidak aktif";
    console.log(
      `${r.rule.padEnd(5)} | ` +
      `${r.nilaiSuhu.toFixed(3).padStart(5)} | ` +
      `${r.nilaiKelembapan.toFixed(3).padStart(11)} | ` +
      `${r.nilaiIntensitas.toFixed(3).padStart(11)} | ` +
      `${r.alpha.toFixed(4).padStart(6)} | ` +
      `${r.output.padEnd(9)} | ${status}`
    );
  });

  console.log("\n=== AGREGASI OUTPUT ===");
  console.log(`α Sebentar : ${agreagatOutput.sebentar.toFixed(4)}`);
  console.log(`α Sedang   : ${agreagatOutput.sedang.toFixed(4)}`);
  console.log(`α Lama     : ${agreagatOutput.lama.toFixed(4)}`);
}
