function hitungDerajatKeanggotaan(x, batas) {
    if (batas.length === 3) {
        let [a, b, c] = batas;
        if (x <= a || x >= c) 
            return 0;
        if (x > a && x <= b) 
            return (x - a) / (b - a); 
        if (x > b && x < c) 
            return (c - x) / (c - b); 
    } else if (batas.length === 4) {
        let [a, b, c, d] = batas;
        if (x < a || x > d) 
            return 0; 
        if (x >= b && x <= c)
            return 1;
        if (x >= a && x < b) 
            return (x - a) / (b - a);
        if (x > c && x <= d) 
            return (d - x) / (d - c); 
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
