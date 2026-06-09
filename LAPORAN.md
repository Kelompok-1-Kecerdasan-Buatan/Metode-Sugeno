# Laporan Teknis: Sistem Fuzzy Sugeno untuk Penyiraman Tanaman Otomatis

## 1. Pendahuluan
Projek ini mengimplementasikan Sistem Inferensi Fuzzy (FIS) menggunakan metode **Sugeno Orde-Nol**. Sistem bertujuan untuk menentukan durasi penyiraman optimal berdasarkan kondisi lingkungan yang ditangkap oleh tiga sensor: Suhu, Kelembapan Tanah, dan Intensitas Cahaya.

## 2. Arsitektur Sistem Fuzzy

### 2.1 Variabel Input (Fuzzifikasi)
Terdapat tiga variabel input yang masing-masing memiliki tiga himpunan fuzzy (Rendah, Sedang, Tinggi) dengan fungsi keanggotaan berbasis Segitiga dan Trapesium:
- **Suhu (°C):** Rentang 15 - 45.
- **Kelembapan Tanah (%):** Rentang 0 - 100.
- **Intensitas Cahaya (%):** Rentang 0 - 100.

### 2.2 Variabel Output (Defuzzifikasi)
Output berupa nilai konstanta (Sugeno Orde-Nol) yang merepresentasikan durasi penyiraman dalam satuan menit:
- **Sebentar:** 5 Menit
- **Sedang:** 15 Menit
- **Lama:** 30 Menit

## 3. Basis Aturan (Rule Base)
Sistem menggunakan **27 aturan (3^3)** untuk menjamin kelengkapan logika. Seluruh kombinasi input telah dipetakan untuk memastikan sistem selalu memberikan output (Z*) yang stabil. 
*(Daftar lengkap aturan dapat dilihat pada panel "Inferensi" di aplikasi).*

## 4. Metodologi Perhitungan
1. **Fuzzifikasi:** Konversi nilai sensor (crisp) menjadi derajat keanggotaan ($\mu$) menggunakan fungsi linear.
2. **Inferensi:** Menggunakan operator **MIN (And)** untuk menentukan nilai $\alpha$-predikat setiap aturan.
3. **Defuzzifikasi:** Menggunakan metode **Weighted Average**:
   $$Z^* = \frac{\sum_{i=1}^{n} (\alpha_i \times Z_i)}{\sum_{i=1}^{n} \alpha_i}$$

## 5. Fitur Unggulan Aplikasi
- **Dashboard Reaktif:** Update data secara real-time tanpa refresh halaman.
- **Visualisasi Kurva:** Grafik interaktif berbasis Chart.js untuk memantau proses fuzzifikasi secara visual.
- **Riwayat Perhitungan:** Fitur simpan data untuk analisis perbandingan skenario.
- **UI Dinamis:** Perubahan warna tema berdasarkan hasil output untuk memudahkan monitoring.

## 6. Kesimpulan
Sistem ini telah diuji dengan berbagai skenario ekstrem dan terbukti mampu memberikan rekomendasi durasi penyiraman yang konsisten dan akurat sesuai dengan kaidah logika fuzzy Sugeno.

---
**Projek AI - Semester 4**
