function prosesDefuzifikasi(hasilPerRule) {
    // Filter hanya rule yang aktif (alpha > 0)
    const ruleAktif = hasilPerRule.filter(r => r.aktif);

    if (ruleAktif.length === 0) {
        return {
            nilaiCrisp: 0,
            totalAlphaZ: 0,
            totalAlpha: 0,
            ruleAktif: [],
            keterangan: "Tidak ada rule yang aktif"
        };
    }

    // Hitung α × Z untuk setiap rule aktif
    const detailDefuz = ruleAktif.map(r => ({
        rule       : r.rule,
        output     : r.output,
        alpha      : r.alpha,
        zKonstanta : r.zKonstanta,
        alphaKaliZ : r.alpha * r.zKonstanta
    }));

    // Σ(α × Z)
    const totalAlphaZ = detailDefuz.reduce((sum, r) => sum + r.alphaKaliZ, 0);

    // Σ(α)
    const totalAlpha = detailDefuz.reduce((sum, r) => sum + r.alpha, 0);

    // Rumus Weighted Average Sugeno: Z* = Σ(αᵢ × Zᵢ) / Σ(αᵢ)
    const nilaiCrisp = totalAlpha === 0 ? 0 : totalAlphaZ / totalAlpha;

    return {
        nilaiCrisp,
        totalAlphaZ,
        totalAlpha,
        detailDefuz,
        keterangan: `Durasi penyiraman: ${nilaiCrisp.toFixed(4)} menit`
    };
}

function tampilHasilDefuzifikasi({ nilaiCrisp, totalAlphaZ, totalAlpha, detailDefuz, keterangan }) {
    console.log("\n=== DEFUZIFIKASI (Weighted Average - Sugeno) ===");
    console.log("Rumus: Z* = Σ(αᵢ × Zᵢ) / Σ(αᵢ)\n");

    console.log("Rule  | Output   | α        | Z (menit) | α × Z");
    console.log("------|----------|----------|-----------|----------");

    detailDefuz.forEach(r => {
        console.log(
            `${r.rule.padEnd(5)} | ` +
            `${r.output.padEnd(8)} | ` +
            `${r.alpha.toFixed(4).padStart(8)} | ` +
            `${String(r.zKonstanta).padStart(9)} | ` +
            `${r.alphaKaliZ.toFixed(4).padStart(10)}`
        );
    });

    console.log("------|----------|----------|-----------|----------");
    console.log(
        `${"TOTAL".padEnd(5)} | ` +
        `${"".padEnd(8)} | ` +
        `${totalAlpha.toFixed(4).padStart(8)} | ` +
        `${"".padStart(9)} | ` +
        `${totalAlphaZ.toFixed(4).padStart(10)}`
    );

    console.log(`\nZ* = ${totalAlphaZ.toFixed(4)} / ${totalAlpha.toFixed(4)}`);
    console.log(`Z* = ${nilaiCrisp.toFixed(4)} menit`);
    console.log(`\n>>> ${keterangan}`);
}
