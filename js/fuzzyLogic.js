function fuzzyLogic() {
    const nilaiSemesta = {
        suhu: {
            rendah: [15, 15, 20, 25],
            sedang: [20, 25, 30],
            tinggi: [27, 30, 45, 45]
        },

        kelembapan: {
            rendah: [0, 0, 40, 50],
            sedang: [40, 50, 75],
            tinggi: [65, 75, 100, 100]
        },

        intensitas: {
            rendah: [0, 0, 40, 50],
            sedang: [40, 50, 75],
            tinggi: [65, 75, 100, 100]
        }
    };

    const aturanFuzzy = [
        // Suhu Rendah
        { r: "R1", suhu: "rendah", kelembapan: "rendah", intensitas: "rendah", output: "sedang" },
        { r: "R2", suhu: "rendah", kelembapan: "rendah", intensitas: "sedang", output: "sedang" },
        { r: "R3", suhu: "rendah", kelembapan: "rendah", intensitas: "tinggi", output: "sedang" },
        { r: "R4", suhu: "rendah", kelembapan: "sedang", intensitas: "rendah", output: "sebentar" },
        { r: "R5", suhu: "rendah", kelembapan: "sedang", intensitas: "sedang", output: "sebentar" },
        { r: "R6", suhu: "rendah", kelembapan: "sedang", intensitas: "tinggi", output: "sebentar" },
        { r: "R7", suhu: "rendah", kelembapan: "tinggi", intensitas: "rendah", output: "sebentar" },
        { r: "R8", suhu: "rendah", kelembapan: "tinggi", intensitas: "sedang", output: "sebentar" },
        { r: "R9", suhu: "rendah", kelembapan: "tinggi", intensitas: "tinggi", output: "sebentar" },

        // Suhu Sedang
        { r: "R10", suhu: "sedang", kelembapan: "rendah", intensitas: "rendah", output: "lama" },
        { r: "R11", suhu: "sedang", kelembapan: "rendah", intensitas: "sedang", output: "lama" },
        { r: "R12", suhu: "sedang", kelembapan: "rendah", intensitas: "tinggi", output: "lama" },
        { r: "R13", suhu: "sedang", kelembapan: "sedang", intensitas: "rendah", output: "sedang" },
        { r: "R14", suhu: "sedang", kelembapan: "sedang", intensitas: "sedang", output: "sedang" },
        { r: "R15", suhu: "sedang", kelembapan: "sedang", intensitas: "tinggi", output: "sedang" },
        { r: "R16", suhu: "sedang", kelembapan: "tinggi", intensitas: "rendah", output: "sebentar" },
        { r: "R17", suhu: "sedang", kelembapan: "tinggi", intensitas: "sedang", output: "sebentar" },
        { r: "R18", suhu: "sedang", kelembapan: "tinggi", intensitas: "tinggi", output: "sebentar" },

        // Suhu Tinggi
        { r: "R19", suhu: "tinggi", kelembapan: "rendah", intensitas: "rendah", output: "lama" },
        { r: "R20", suhu: "tinggi", kelembapan: "rendah", intensitas: "sedang", output: "lama" },
        { r: "R21", suhu: "tinggi", kelembapan: "rendah", intensitas: "tinggi", output: "lama" },
        { r: "R22", suhu: "tinggi", kelembapan: "sedang", intensitas: "rendah", output: "lama" },
        { r: "R23", suhu: "tinggi", kelembapan: "sedang", intensitas: "sedang", output: "lama" },
        { r: "R24", suhu: "tinggi", kelembapan: "sedang", intensitas: "tinggi", output: "sedang" },
        { r: "R25", suhu: "tinggi", kelembapan: "tinggi", intensitas: "rendah", output: "sedang" },
        { r: "R26", suhu: "tinggi", kelembapan: "tinggi", intensitas: "sedang", output: "sedang" },
        { r: "R27", suhu: "tinggi", kelembapan: "tinggi", intensitas: "tinggi", output: "sebentar" }
    ];

    return {nilaiSemesta, aturanFuzzy};
}