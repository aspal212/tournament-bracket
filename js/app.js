// js/exportUtils.js (atau tambahkan di app.js)

function exportResults(format = 'json') {
    const tournamentData = JSON.parse(localStorage.getItem('tournamentData')) || {};
    const players = tournamentData.players || [];
    const title = tournamentData.title || 'Turnamen';

    // Data hasil turnamen (untuk demo, kita asumsikan pemenang = pemain pertama)
    // Di aplikasi nyata, ambil dari state bracket
    const winner = players.length > 0 ? players[0] : 'Tidak ada pemenang';

    const results = {
        title: title,
        date: new Date().toISOString().split('T')[0],
        totalPlayers: players.length,
        players: players,
        winner: winner,
        format: 'single-elimination'
    };

    if (format === 'json') {
        const dataStr = JSON.stringify(results, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_results.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {
        // CSV: nama, status
        let csvContent = 'Nama,Status\n';
        players.forEach(p => {
            const status = (p === winner) ? 'Pemenang' : 'Peserta';
            csvContent += `"${p}","${status}"
`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_results.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Pasang event listener
document.getElementById('export-results')?.addEventListener('click', () => {
    const format = prompt('Export sebagai? (json/csv)', 'json')?.trim().toLowerCase();
    if (format === 'json' || format === 'csv') {
        exportResults(format);
    } else {
        alert('Format hanya mendukung json atau csv.');
    }
});
// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    // ... kode setup lainnya

    document.getElementById('reset-tournament')?.addEventListener('click', () => {
        if (confirm('Reset turnamen? Semua data akan hilang.')) {
            localStorage.removeItem('tournamentData');
            window.location.reload();
        }
    });
});