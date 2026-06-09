function prosesInferensi(muSuhu, muKelembapan, muIntensitas) {

  const { aturanFuzzy } = fuzzyLogic();

  const nilaiKonstanta = {
    sebentar : 5,
    sedang   : 15,
    lama     : 30,
  };

  const hasilPerRule = aturanFuzzy.map(rule => {
    const nilaiSuhu       = muSuhu[rule.suhu];
    const nilaiKelembapan = muKelembapan[rule.kelembapan];
    const nilaiIntensitas = muIntensitas[rule.intensitas];
    const alpha           = Math.min(nilaiSuhu, nilaiKelembapan, nilaiIntensitas);
    const zKonstanta      = nilaiKonstanta[rule.output];

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
      zKonstanta,
      aktif           : alpha > 0,
    };
  });

  return { hasilPerRule };
}


function tampilHasilInferensi(hasilPerRule) {

  console.log("=== HASIL INFERENSI (Sugeno) ===");
  console.log("Rule  | μSuhu | μKelembapan | μIntensitas | α=MIN  | Z (menit) | α×Z    | Status");
  console.log("------|-------|-------------|-------------|--------|-----------|--------|-------");

  hasilPerRule.forEach(r => {
    const status = r.aktif ? "✓ AKTIF" : "- tidak aktif";
    console.log(
      `${r.rule.padEnd(5)} | ` +
      `${r.nilaiSuhu.toFixed(3).padStart(5)} | ` +
      `${r.nilaiKelembapan.toFixed(3).padStart(11)} | ` +
      `${r.nilaiIntensitas.toFixed(3).padStart(11)} | ` +
      `${r.alpha.toFixed(4).padStart(6)} | ` +
      `${String(r.zKonstanta).padStart(9)} | ` +
      `${(r.alpha * r.zKonstanta).toFixed(4).padStart(6)} | ` +
      `${status}`
    );
  });
}
