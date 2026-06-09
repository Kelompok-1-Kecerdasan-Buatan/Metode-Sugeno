function hitungDerajatKeanggotaan(x, batas) {
    // Tipe Segitiga [a, b, c]
    if (batas.length === 3) {
        const [a, b, c] = batas;
        if (x <= a || x >= c) return 0;
        if (x === b) return 1;
        if (x > a && x < b) return (b - a === 0) ? 1 : (x - a) / (b - a);
        if (x > b && x < c) return (c - b === 0) ? 1 : (c - x) / (c - b);
    } 
    // Tipe Trapesium [a, b, c, d]
    else if (batas.length === 4) {
        const [a, b, c, d] = batas;
        if (x < a || x > d) return 0;
        if (x >= b && x <= c) return 1;
        if (x >= a && x < b) return (b - a === 0) ? 1 : (x - a) / (b - a);
        if (x > c && x <= d) return (d - c === 0) ? 1 : (d - x) / (d - c);
    }
    return 0;
}

function prosesFuzzifikasi(suhuCrisp, kelembapanCrisp, intensitasCrisp) {
    const { nilaiSemesta } = fuzzyLogic(); 
    const muSuhu = {
        rendah: hitungDerajatKeanggotaan(suhuCrisp, nilaiSemesta.suhu.rendah),
        sedang: hitungDerajatKeanggotaan(suhuCrisp, nilaiSemesta.suhu.sedang),
        tinggi: hitungDerajatKeanggotaan(suhuCrisp, nilaiSemesta.suhu.tinggi)
    };
    const muKelembapan = {
        rendah: hitungDerajatKeanggotaan(kelembapanCrisp, nilaiSemesta.kelembapan.rendah),
        sedang: hitungDerajatKeanggotaan(kelembapanCrisp, nilaiSemesta.kelembapan.sedang),
        tinggi: hitungDerajatKeanggotaan(kelembapanCrisp, nilaiSemesta.kelembapan.tinggi)
    };
    const muIntensitas = {
        rendah: hitungDerajatKeanggotaan(intensitasCrisp, nilaiSemesta.intensitas.rendah),
        sedang: hitungDerajatKeanggotaan(intensitasCrisp, nilaiSemesta.intensitas.sedang),
        tinggi: hitungDerajatKeanggotaan(intensitasCrisp, nilaiSemesta.intensitas.tinggi)
    };
    return { muSuhu, muKelembapan, muIntensitas };
}
