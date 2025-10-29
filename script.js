// Variabel global untuk menyimpan data turnamen
let tournament = {
    name: '',
    participants: [],
    bracketStructure: [],
    currentRoundIndex: 0
};

// Fungsi untuk menghasilkan struktur bracket
function generateBracket() {
    // Ambil data dari form
    tournament.name = document.getElementById('tournamentName').value;
    const numParticipants = parseInt(document.getElementById('numParticipants').value);
    const participantsInput = document.getElementById('participantsList').value;
    
    // Validasi input
    if (!tournament.name || !numParticipants || !participantsInput.trim()) {
        showError('Semua field harus diisi!');
        return;
    }
    
    // Validasi jumlah peserta (harus bilangan berpangkat 2)
    if (!isPowerOfTwo(numParticipants)) {
        showError('Jumlah peserta harus bilangan berpangkat 2 (2, 4, 8, 16, dll)');
        return;
    }
    
    // Ambil daftar peserta
    const participants = participantsInput.split('
')
        .map(name => name.trim())
        .filter(name => name !== '');
    
    // Validasi jumlah peserta
    if (participants.length !== numParticipants) {
        showError(`Jumlah peserta yang diinput (${participants.length}) tidak sesuai dengan jumlah yang dimasukkan (${numParticipants})`);
        return;
    }
    
    // Simpan data ke dalam objek tournament
    tournament.participants = participants;
    
    // Generate struktur bracket
    tournament.bracketStructure = generateBracketStructure(participants);
    
    // Tampilkan bracket
    displayBracket();
    
    // Aktifkan tombol "Next Round"
    document.getElementById('nextRoundButton').disabled = false;
}

// Fungsi untuk memeriksa apakah bilangan adalah pangkat 2
function isPowerOfTwo(n) {
    return (n & (n - 1)) === 0 && n !== 0;
}

// Fungsi untuk menghasilkan struktur bracket
function generateBracketStructure(participants) {
    const rounds = [];
    let currentRound = [...participants];
    
    // Buat struktur bracket untuk setiap babak
    while (currentRound.length > 1) {
        const matches = [];
        // Buat pasangan pertandingan
        for (let i = 0; i < currentRound.length; i += 2) {
            matches.push({
                p1: currentRound[i],
                p2: currentRound[i + 1] || null,
                winner: null
            });
        }
        rounds.push(matches);
        // Siapkan untuk babak berikutnya
        currentRound = matches.map(match => match.winner).filter(winner => winner !== null);
    }
    return rounds;
}

// Fungsi untuk menampilkan bracket
function displayBracket() {
    const bracketDisplay = document.getElementById('bracketDisplay');
    bracketDisplay.innerHTML = '';
    
    // Tampilkan header turnamen
    const tournamentHeader = document.createElement('div');
    tournamentHeader.className = 'tournament-header';
    tournamentHeader.innerHTML = `
        <h2>${tournament.name}</h2>
        <p>Jumlah Peserta: ${tournament.participants.length}</p>
    `;
    bracketDisplay.appendChild(tournamentHeader);
    
    // Tampilkan setiap babak
    tournament.bracketStructure.forEach((round, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        
        // Header babak
        const roundHeader = document.createElement('div');
        roundHeader.className = 'round-header';
        roundHeader.innerHTML = `
            <h3>Babak ${roundIndex + 1}</h3>
            <span>${roundIndex + 1} dari ${tournament.bracketStructure.length} Babak</span>
        `;
        roundDiv.appendChild(roundHeader);
        
        // Konten babak
        const roundContent = document.createElement('div');
        roundContent.className = 'round-content';
        
        // Tampilkan setiap pertandingan dalam babak
        round.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            
            // Jika pertandingan sudah memiliki pemenang
            if (match.winner) {
                // Tampilkan pemenang
                const winnerDiv = document.createElement('div');
                winnerDiv.className = 'winner';
                winnerDiv.textContent = `Pemenang: ${match.winner}`;
                matchDiv.appendChild(winnerDiv);
            } else {
                // Tampilkan informasi pertandingan
                const player1 = document.createElement('div');
                player1.className = 'match-left';
                player1.innerHTML = `<span class="player">${match.p1}</span>`;
                
                const vs = document.createElement('div');
                vs.className = 'vs';
                vs.textContent = 'vs';
                
                const player2 = document.createElement('div');
                player2.className = 'match-right';
                player2.innerHTML = `<span class="player">${match.p2}</span>`;
                
                // Tampilkan tombol pilihan pemenang
                const winnerSelect = document.createElement('div');
                winnerSelect.className = 'winner-select';
                
                const winnerButton1 = document.createElement('button');
                winnerButton1.className = 'winner-button';
                winnerButton1.textContent = match.p1;
                winnerButton1.onclick = () => selectWinner(match, match.p1);
                
                const winnerButton2 = document.createElement('button');
                winnerButton2.className = 'winner-button';
                winnerButton2.textContent = match.p2;
                winnerButton2.onclick = () => selectWinner(match, match.p2);
                
                winnerSelect.appendChild(winnerButton1);
                winnerSelect.appendChild(winnerButton2);
                
                matchDiv.appendChild(player1);
                matchDiv.appendChild(vs);
                matchDiv.appendChild(player2);
                matchDiv.appendChild(winnerSelect);
            }
            
            roundContent.appendChild(matchDiv);
        });
        
        roundDiv.appendChild(roundContent);
        bracketDisplay.appendChild(roundDiv);
    });
    
    // Perbarui informasi babak
    updateRoundInfo();
}

// Fungsi untuk memilih pemenang pertandingan
function selectWinner(match, winner) {
    match.winner = winner;
    
    // Perbarui tampilan bracket
    displayBracket();
    
    // Periksa apakah semua pertandingan di babak ini sudah memiliki pemenang
    const currentRound = tournament.bracketStructure[tournament.currentRoundIndex];
    const allMatchComplete = currentRound.every(match => match.winner !== null);
    
    // Jika semua pertandingan selesai, lanjut ke babak berikutnya
    if (allMatchComplete && tournament.currentRoundIndex < tournament.bracketStructure.length - 1) {
        tournament.currentRoundIndex++;
        displayBracket();
        updateRoundInfo();
    }
}

// Fungsi untuk memperbarui informasi babak
function updateRoundInfo() {
    const currentRound = tournament.bracketStructure[tournament.currentRoundIndex];
    const isFinalRound = tournament.currentRoundIndex === tournament.bracketStructure.length - 1;
    
    // Perbarui informasi tombol next round
    const nextRoundButton = document.getElementById('nextRoundButton');
    if (isFinalRound) {
        nextRoundButton.textContent = 'Selesai';
        nextRoundButton.disabled = true;
    } else {
        nextRoundButton.textContent = 'Next Round';
        nextRoundButton.disabled = false;
    }
}

// Fungsi untuk reset tampilan
function reset() {
    // Kosongkan form
    document.getElementById('tournamentForm').reset();
    
    // Kosongkan tampilan bracket
    document.getElementById('bracketDisplay').innerHTML = '';
    
    // Reset variabel global
    tournament = {
        name: '',
        participants: [],
        bracketStructure: [],
        currentRoundIndex: 0
    };
    
    // Nonaktifkan tombol next round
    document.getElementById('nextRoundButton').disabled = true;
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Tambahkan ke dalam form
    const formSection = document.querySelector('.form-section');
    formSection.appendChild(errorElement);
    
    // Hapus pesan error setelah beberapa detik
    setTimeout(() => {
        formSection.removeChild(errorElement);
    }, 5000);
}

// Event listener untuk tombol generate
document.getElementById('generateButton').addEventListener('click', generateBracket);

// Event listener untuk tombol next round
document.getElementById('nextRoundButton').addEventListener('click', () => {
    if (tournament.currentRoundIndex < tournament.bracketStructure.length - 1) {
        tournament.currentRoundIndex++;
        displayBracket();
    }
});

// Event listener untuk tombol reset
document.getElementById('resetButton').addEventListener('click', reset);