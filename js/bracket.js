// js/bracket.js

/**
 * Generate bracket HTML dari daftar peserta
 * @param {string[]} players - Array nama peserta
 */
function generateBracket(players) {
    if (!players || players.length === 0) {
        document.getElementById('bracket-container').innerHTML = '<p>Tidak ada peserta.</p>';
        return;
    }

    // Bulatkan ke 2^n terdekat
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(players.length)));
    const paddedPlayers = [...players];
    while (paddedPlayers.length < nextPowerOfTwo) {
        paddedPlayers.push(null); // Bye
    }

    const rounds = Math.log2(nextPowerOfTwo);
    const bracketContainer = document.getElementById('bracket-container');
    bracketContainer.innerHTML = '';

    let currentRound = paddedPlayers.map(p => ({ player: p, winner: p }));

    for (let round = 0; round < rounds; round++) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        roundDiv.innerHTML = `<div class="round-header">Babak ${round + 1}</div>`;

        const nextRound = [];

        for (let i = 0; i < currentRound.length; i += 2) {
            const match = document.createElement('div');
            match.className = 'match';

            const p1 = currentRound[i];
            const p2 = currentRound[i + 1] || { player: null, winner: null };

            match.innerHTML = `
                <div class="player ${!p1.player ? 'bye' : ''}" data-player="${p1.player || ''}">
                    ${p1.player || 'Bye'}
                </div>
                <div class="vs">VS</div>
                <div class="player ${!p2.player ? 'bye' : ''}" data-player="${p2.player || ''}">
                    ${p2.player || 'Bye'}
                </div>
                <div class="winner-placeholder">❓</div>
            `;
            roundDiv.appendChild(match);

            // Simulasi sementara: pilih pemenang acak (atau nanti diisi manual)
            // Untuk demo, kita asumsikan pemenang adalah peserta pertama yang valid
            const winner = p1.player || p2.player;
            nextRound.push({ player: winner, winner });
        }

        bracketContainer.appendChild(roundDiv);
        currentRound = nextRound;
    }

    // Tampilkan pemenang akhir
    const finalWinner = currentRound[0]?.winner;
    if (finalWinner) {
        document.getElementById('winner-name').textContent = finalWinner;
        document.getElementById('winner-section').classList.remove('hidden');
    }
}

/**
 * Inisialisasi bracket saat halaman tournament dimuat
 */
function initBracket() {
    const tournamentData = JSON.parse(localStorage.getItem('tournamentData')) || {};
    const players = tournamentData.players || [];
    const title = tournamentData.title || 'Turnamen Tidak Bernama';
    document.getElementById('tournament-title').textContent = title;
    generateBracket(players);
}

// Panggil saat DOM siap (di app.js nanti)
// Atau langsung jika skrip dimuat setelah elemen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBracket);
} else {
    initBracket();
}