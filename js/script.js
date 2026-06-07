// ── Elemen DOM ──
const elSuhu        = document.getElementById('suhu');
const elKelembapan  = document.getElementById('kelembapan');
const elIntensitas  = document.getElementById('intensitas');
const elSuhuVal     = document.getElementById('suhu-val');
const elKelembapanVal = document.getElementById('kelembapan-val');
const elIntensitasVal = document.getElementById('intensitas-val');

const elSuhuNum       = document.getElementById('suhu-num');
const elKelembapanNum = document.getElementById('kelembapan-num');
const elIntensitasNum = document.getElementById('intensitas-num');

const elResultValue = document.getElementById('result-value');
const elResultTag   = document.getElementById('result-tag');

const elFuzOutput = document.getElementById('fuz-output');
const elInfOutput = document.getElementById('inf-output');
const elDefOutput = document.getElementById('def-output');

const btnHitung = document.getElementById('btn-hitung');

// ── Sync slider ↔ number input ──
function syncSliderToNum(slider, numInput, output) {
    slider.addEventListener('input', () => {
        const v = parseFloat(slider.value).toFixed(1);
        output.textContent = v;
        numInput.value = v;
        hitungLive();
    });
    numInput.addEventListener('input', () => {
        let v = parseFloat(numInput.value);
        if (isNaN(v)) return;
        v = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), v));
        slider.value = v;
        output.textContent = v.toFixed(1);
        hitungLive();
    });
}

syncSliderToNum(elSuhu,       elSuhuNum,       elSuhuVal);
syncSliderToNum(elKelembapan, elKelembapanNum, elKelembapanVal);
syncSliderToNum(elIntensitas, elIntensitasNum, elIntensitasVal);

// ── Hitung live (hanya mu-pills & result hero) ──
function hitungLive() {
    const s = parseFloat(elSuhu.value);
    const k = parseFloat(elKelembapan.value);
    const i = parseFloat(elIntensitas.value);
    const { muSuhu, muKelembapan, muIntensitas } = prosesFuzzifikasi(s, k, i);
    renderMuPills('mu-suhu',       muSuhu);
    renderMuPills('mu-kelembapan', muKelembapan);
    renderMuPills('mu-intensitas', muIntensitas);
}

// ── Tombol Hitung → tampil semua panel ──
btnHitung.addEventListener('click', () => {
    const s = parseFloat(elSuhu.value);
    const k = parseFloat(elKelembapan.value);
    const i = parseFloat(elIntensitas.value);
    jalankan(s, k, i);
});

// ── Core proses ──
function jalankan(s, k, i) {
    const fuz = prosesFuzzifikasi(s, k, i);
    const inf = prosesInferensi(fuz.muSuhu, fuz.muKelembapan, fuz.muIntensitas);
    const def = prosesDefuzifikasi(inf.hasilPerRule);

    renderResultHero(def);
    renderFuzzifikasi(fuz);
    renderInferensi(inf.hasilPerRule);
    renderDefuzifikasi(def);
}

// ── Mu pills (live) ──
function renderMuPills(containerId, muObj) {
    const el = document.getElementById(containerId);
    el.innerHTML = Object.entries(muObj).map(([label, val]) => {
        const isZero = val === 0;
        return `<span class="mu-pill ${label}${isZero ? ' zero' : ''}">${label}: ${val.toFixed(3)}</span>`;
    }).join('');
}

// ── Result Hero ──
function renderResultHero({ nilaiCrisp }) {
    elResultValue.textContent = nilaiCrisp.toFixed(2);
    let label = '—', cls = '';
    if      (nilaiCrisp <= 7)  { label = 'Sebentar'; cls = 'sebentar'; }
    else if (nilaiCrisp <= 20) { label = 'Sedang';   cls = 'sedang';   }
    else                        { label = 'Lama';     cls = 'lama';     }
    elResultTag.textContent = label;
    elResultTag.className   = `result-tag ${cls}`;
}

// ── Panel Fuzzifikasi ──
function renderFuzzifikasi({ muSuhu, muKelembapan, muIntensitas }) {
    const rows = [
        ['Suhu',       muSuhu],
        ['Kelembapan', muKelembapan],
        ['Intensitas', muIntensitas]
    ].map(([nama, mu]) =>
        Object.entries(mu).map(([kat, val]) => {
            const bar = Math.round(val * 80);
            return `<tr>
                <td class="var-name">${nama}</td>
                <td>${kat}</td>
                <td class="mu-val">${val.toFixed(4)}
                  <span class="mu-bar" style="width:${bar}px"></span>
                </td>
            </tr>`;
        }).join('')
    ).join('');

    elFuzOutput.innerHTML = `
        <table class="fuz-table">
            <thead><tr><th>Variabel</th><th>Himpunan</th><th style="text-align:right">μ</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── Panel Inferensi ──
function renderInferensi(hasilPerRule) {
    const rows = hasilPerRule.map(r => {
        const aktifClass = r.aktif ? 'aktif' : '';
        const dot = `<span class="status-dot ${aktifClass}"></span>`;
        return `<tr class="${aktifClass}">
            <td class="rule-id">${r.rule}</td>
            <td>${r.suhu}</td>
            <td>${r.kelembapan}</td>
            <td>${r.intensitas}</td>
            <td><span class="badge-output ${r.output}">${r.output}</span></td>
            <td>${r.alpha.toFixed(4)}</td>
            <td>${dot}${r.aktif ? 'aktif' : 'tidak'}</td>
        </tr>`;
    }).join('');

    elInfOutput.innerHTML = `
        <table class="inf-table">
            <thead><tr>
                <th>Rule</th><th>Suhu</th><th>Kelembapan</th>
                <th>Intensitas</th><th>Output</th><th>α</th><th>Status</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── Panel Defuzifikasi ──
function renderDefuzifikasi({ nilaiCrisp, totalAlphaZ, totalAlpha, detailDefuz, keterangan }) {
    if (!detailDefuz || detailDefuz.length === 0) {
        elDefOutput.innerHTML = `<p class="placeholder">Tidak ada rule aktif.</p>`;
        return;
    }

    const rows = detailDefuz.map(r => `<tr>
        <td>${r.rule}</td>
        <td><span class="badge-output ${r.output}">${r.output}</span></td>
        <td>${r.alpha.toFixed(4)}</td>
        <td>${r.zKonstanta}</td>
        <td>${r.alphaKaliZ.toFixed(4)}</td>
    </tr>`).join('');

    elDefOutput.innerHTML = `
        <table class="def-table">
            <thead><tr>
                <th style="text-align:left">Rule</th>
                <th style="text-align:left">Output</th>
                <th>α</th>
                <th>Z (mnt)</th>
                <th>α × Z</th>
            </tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr class="total-row">
                <td colspan="2">Total</td>
                <td>${totalAlpha.toFixed(4)}</td>
                <td>—</td>
                <td>${totalAlphaZ.toFixed(4)}</td>
            </tr></tfoot>
        </table>
        <div class="def-summary">
            <span>Z* =</span>
            <span class="eq">${totalAlphaZ.toFixed(4)} / ${totalAlpha.toFixed(4)} = <strong>${nilaiCrisp.toFixed(4)} menit</strong></span>
        </div>`;
}

// ── Init ──
hitungLive();
jalankan(
    parseFloat(elSuhu.value),
    parseFloat(elKelembapan.value),
    parseFloat(elIntensitas.value)
);
