class TournamentApp {
    // ... (kode sebelumnya)
    
    createTournament() {
        // ... (kode sebelumnya)
        
        this.tournament = new Tournament(tournamentName, participants);
        this.bracket = new Bracket(this.tournament);
        
        document.getElementById('tournament-title').textContent = tournamentName;
        
        this.showSection('tournament-section');
        
        // Tampilkan semua babak sekaligus
        this.bracket.displayAllRounds();
        
        // Hilangkan tombol navigasi
        document.getElementById('bracket-navigation').style.display = 'none';
    }
    
    // Fungsi untuk mengatur tampilan
    showSection(sectionId) {
        // ... (kode sebelumnya)
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new TournamentApp();
});