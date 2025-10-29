class Bracket {
    constructor(tournament) {
        this.tournament = tournament;
        this.container = document.getElementById('bracket-container');
    }

    // Fungsi utama untuk menampilkan semua babak
    displayAllRounds() {
        this.container.innerHTML = '';
        
        const roundsContainer = document.createElement('div');
        roundsContainer.className = 'rounds-container';
        
        const roundNames = this.tournament.getRoundNames();
        
        this.tournament.rounds.forEach((round, roundIndex) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            const roundTitle = document.createElement('h3');
            roundTitle.textContent = roundNames[roundIndex];
            roundDiv.appendChild(roundTitle);
            
            round.forEach((match, matchIndex) => {
                const matchElement = this.createMatchElement(match, roundIndex, matchIndex);
                roundDiv.appendChild(matchElement);
            });
            
            roundsContainer.appendChild(roundDiv);
        });
        
        this.container.appendChild(roundsContainer);
    }

    // Fungsi untuk menambahkan event handler
    createMatchElement(match, roundIndex, matchIndex) {
        // ... (kode sama seperti sebelumnya)
    }

    // Fungsi untuk memilih pemenang
    selectWinner(winner, roundIndex, matchIndex) {
        // ... (kode sama seperti sebelumnya)
        
        // Refresh semua babak setelah pemenang dipilih
        this.displayAllRounds();
        
        // Jika semua babak selesai, tampilkan pemenang
        if (this.tournament.isComplete()) {
            const winner = this.tournament.getWinner();
            document.getElementById('winner-name').textContent = winner.name;
            document.getElementById('winner-section').classList.remove('hidden');
        }
    }
}