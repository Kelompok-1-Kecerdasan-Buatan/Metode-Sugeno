function fuzzyLogic() {
    const nilaiSemesta = {
        suhu: {
            rendah: [15, 15, 20, 25],
            sedang: [20, 25, 30],
            tinggi: [25, 30, 45, 45]
        },

        kelembapan: {
            rendah: [10, 10, 40, 50],
            sedang: [40, 50, 65, 70],
            tinggi: [65, 70, 100, 100]
        },

        intensitas: {
            rendah: [0, 0, 30, 45],
            sedang: [30, 45, 70, 80],
            tinggi: [70, 80, 100, 100]
        }
    };

    const aturanFuzzy = [
        { r: "R1", suhu: "tinggi", kelembapan: "rendah", intensitas: "tinggi", output: "lama" },
        { r: "R2", suhu: "rendah", kelembapan: "tinggi", intensitas: "rendah", output: "sebentar" },
        { r: "R3", suhu: "tinggi", kelembapan: "rendah", intensitas: "rendah", output: "sedang" },
        { r: "R4", suhu: "sedang", kelembapan: "rendah", intensitas: "tinggi", output: "sedang" },
        { r: "R5", suhu: "rendah", kelembapan: "sedang", intensitas: "sedang",  output: "sebentar" },
        { r: "R6", suhu: "tinggi", kelembapan: "sedang", intensitas: "rendah", output: "sedang" },
        { r: "R7", suhu: "sedang", kelembapan: "tinggi", intensitas: "tinggi", output: "sebentar" },
        { r: "R8", suhu: "rendah", kelembapan: "tinggi", intensitas: "tinggi", output: "sebentar" },
        { r: "R9", suhu: "tinggi", kelembapan: "sedang", intensitas: "tinggi", output: "sedang" }
    ];

    return {nilaiSemesta, aturanFuzzy};
}