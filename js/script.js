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
const elResultHero  = document.getElementById('result-hero');

const elFuzOutput = document.getElementById('fuz-output');
const elInfOutput = document.getElementById('inf-output');
const elDefOutput = document.getElementById('def-output');

const btnHitung = document.getElementById('btn-hitung');
const elHistoryOutput = document.getElementById('history-output');
const btnClearHistory = document.getElementById('btn-clear-history');

let riwayat = [];
let charts = {};

// ── Sync slider ↔ number input ──
function syncSliderToNum(slider, numInput, output) {
    slider.addEventListener('input', () => {
        const v = parseFloat(slider.value).toFixed(1);
        output.textContent = v;
        numInput.value = v;
        update(true); 
    });
    numInput.addEventListener('input', () => {
        let v = parseFloat(numInput.value);
        if (isNaN(v)) return;
        v = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), v));
        slider.value = v;
        output.textContent = v.toFixed(1);
        update(true);
    });
}

if (elSuhu) syncSliderToNum(elSuhu, elSuhuNum, elSuhuVal);
if (elKelembapan) syncSliderToNum(elKelembapan, elKelembapanNum, elKelembapanVal);
if (elIntensitas) syncSliderToNum(elIntensitas, elIntensitasNum, elIntensitasVal);

// ── Chart.js Initialization ──
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    const { nilaiSemesta } = fuzzyLogic();
    const config = (label, data, min, max) => ({
        type: 'line',
        data: {
            datasets: Object.entries(data).map(([key, val], idx) => {
                const colors = ['#1d9e75', '#ba7517', '#d85a30'];
                let points = [];
                if (val.length === 3) {
                    points = [{x: min, y: 0}, {x: val[0], y: 0}, {x: val[1], y: 1}, {x: val[2], y: 0}, {x: max, y: 0}];
                } else {
                    points = [{x: min, y: 0}, {x: val[0], y: 0}, {x: val[1], y: 1}, {x: val[2], y: 1}, {x: val[3], y: 0}, {x: max, y: 0}];
                }
                return {
                    label: key,
                    data: points.sort((a,b) => a.x - b.x),
                    borderColor: colors[idx],
                    backgroundColor: colors[idx] + '22',
                    fill: true,
                    tension: 0,
                    pointRadius: 0
                };
            })
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: { type: 'linear', min, max, display: false },
                y: { min: 0, max: 1.1, display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    const canvasSuhu = document.getElementById('chart-suhu');
    const canvasKel = document.getElementById('chart-kelembapan');
    const canvasInt = document.getElementById('chart-intensitas');

    if (canvasSuhu) charts.suhu = new Chart(canvasSuhu, config('Suhu', nilaiSemesta.suhu, 15, 45));
    if (canvasKel) charts.kelembapan = new Chart(canvasKel, config('Kelembapan', nilaiSemesta.kelembapan, 0, 100));
    if (canvasInt) charts.intensitas = new Chart(canvasInt, config('Intensitas', nilaiSemesta.intensitas, 0, 100));
}

function updateCharts(s, k, i) {
    const updateLine = (chart, val) => {
        if (!chart) return;
        if (chart.data.datasets.length > 3) chart.data.datasets.pop();
        chart.data.datasets.push({
            label: 'Current',
            data: [{x: val, y: 0}, {x: val, y: 1}],
            borderColor: 'rgba(0,0,0,0.6)',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0
        });
        chart.update('none');
    };
    updateLine(charts.suhu, s);
    updateLine(charts.kelembapan, k);
    updateLine(charts.intensitas, i);
}

// ── Core Update Logic ──
function update(fullRender = true) {
    const s = parseFloat(elSuhu.value);
    const k = parseFloat(elKelembapan.value);
    const i = parseFloat(elIntensitas.value);
    
    const fuz = prosesFuzzifikasi(s, k, i);
    renderMuPills('mu-suhu',       fuz.muSuhu);
    renderMuPills('mu-kelembapan', fuz.muKelembapan);
    renderMuPills('mu-intensitas', fuz.muIntensitas);
    
    if (charts.suhu) updateCharts(s, k, i);

    const inf = prosesInferensi(fuz.muSuhu, fuz.muKelembapan, fuz.muIntensitas);
    const def = prosesDefuzifikasi(inf.hasilPerRule);

    renderResultHero(def);

    if (fullRender) {
        renderFuzzifikasi(fuz);
        renderInferensi(inf.hasilPerRule);
        renderDefuzifikasi(def);
    }
}

// ── Result Hero ──
function renderResultHero({ nilaiCrisp, totalAlpha }) {
    if (!elResultValue || !elResultTag || !elResultHero) return;

    if (totalAlpha === 0) {
        elResultValue.textContent = "—";
        elResultTag.textContent = "Input diluar jangkauan aturan";
        elResultTag.className = "result-tag";
        elResultHero.className = "result-hero card";
        return;
    }

    elResultValue.textContent = nilaiCrisp.toFixed(2);
    let label = '—', cls = '';
    if      (nilaiCrisp <= 7)  { label = 'Sebentar'; cls = 'sebentar'; }
    else if (nilaiCrisp <= 20) { label = 'Sedang';   cls = 'sedang';   }
    else                        { label = 'Lama';     cls = 'lama';     }
    
    elResultTag.textContent = label;
    elResultTag.className   = `result-tag ${cls}`;
    elResultHero.className  = `result-hero card ${cls}`;
}

// ── Panel Fuzzifikasi ──
function renderFuzzifikasi({ muSuhu, muKelembapan, muIntensitas }) {
    if (!elFuzOutput) return;
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
    if (!elInfOutput) return;
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
function renderDefuzifikasi({ nilaiCrisp, totalAlphaZ, totalAlpha, detailDefuz }) {
    if (!elDefOutput) return;
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

// ── Panel Riwayat ──
function renderRiwayat() {
    if (!elHistoryOutput) return;
    if (riwayat.length === 0) {
        elHistoryOutput.innerHTML = `<p class="placeholder">Belum ada riwayat yang disimpan.</p>`;
        return;
    }

    const rows = riwayat.map(r => `
        <tr>
            <td>${r.waktu}</td>
            <td>${r.suhu}°C</td>
            <td>${r.kelembapan}%</td>
            <td>${r.intensitas}%</td>
            <td class="hist-val">${r.totalAlpha === 0 ? '—' : r.hasil.toFixed(2) + ' mnt'}</td>
        </tr>
    `).join('');

    elHistoryOutput.innerHTML = `
        <table class="history-table">
            <thead>
                <tr>
                    <th>Waktu</th><th>Suhu</th><th>Kelembapan</th><th>Intensitas</th><th>Hasil</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── Mu pills (live) ──
function renderMuPills(containerId, muObj) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Object.entries(muObj).map(([label, val]) => {
        const isZero = val === 0;
        return `<span class="mu-pill ${label}${isZero ? ' zero' : ''}">${label}: ${val.toFixed(3)}</span>`;
    }).join('');
}

// ── Event Listeners ──
if (btnHitung) {
    btnHitung.addEventListener('click', () => {
        const s = parseFloat(elSuhu.value);
        const k = parseFloat(elKelembapan.value);
        const i = parseFloat(elIntensitas.value);
        
        const fuz = prosesFuzzifikasi(s, k, i);
        const inf = prosesInferensi(fuz.muSuhu, fuz.muKelembapan, fuz.muIntensitas);
        const def = prosesDefuzifikasi(inf.hasilPerRule);

        const dataBaru = {
            waktu: new Date().toLocaleTimeString('id-ID'),
            suhu: s,
            kelembapan: k,
            intensitas: i,
            hasil: def.nilaiCrisp,
            totalAlpha: def.totalAlpha
        };
        
        riwayat.unshift(dataBaru);
        if (riwayat.length > 10) riwayat.pop();
        
        renderRiwayat();
        update(true);
    });
}

if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
        riwayat = [];
        renderRiwayat();
    });
}

// ── Init ──
window.onload = () => {
    initCharts();
    update(true);
    if (typeof lucide !== 'undefined') lucide.createIcons();
};
