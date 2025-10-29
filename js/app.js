class TournamentApp {
    constructor() {
        this.tournament = null;
        this.bracket = null;
        this.currentRound = 0;
        
        this.initEventListeners();
        this.generateParticipantInputs();
    }

    initEventListeners() {
        document.getElementById('participant-count').addEventListener('change', () => {
            this.generateParticipantInputs();
        });

        document.getElementById('generate-bracket').addEventListener('click', () => {
            this.createTournament();
        });

        document.getElementById('reset-tournament').addEventListener('click', () => {
            this.resetTournament();
        });

        document.getElementById('prev-round').addEventListener('click', () => {
            this.navigateRound(-1);
        });

        document.getElementById('next-round').addEventListener('click', () => {
            this.navigateRound(1);
        });

        document.getElementById('export-results').addEventListener('click', () => {
            this.exportResults();
        });
    }

    generateParticipantInputs() {
        const count = parseInt(document.getElementById('participant-count').value);
        const container = document.getElementById('participants-input');
        
        container.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Peserta ${i}`;
            input.id = `participant-${i}`;
            container.appendChild(input);
        }
    }

    createTournament() {
        const tournamentName = document.getElementById('tournament-name').value.trim();
        const participantCount = parseInt(document.getElementById('participant-count').value);
        
        if (!tournamentName) {
            alert('Masukkan nama turnamen!');
            return;
        }

        const participants = [];
        for (let i = 1; i <= participantCount; i++) {
            const name = document.getElementById(`participant-${i}`).value.trim();
            if (!name) {
                alert(`Masukkan nama peserta ${i}!`);
                return;
            }
            participants.push({ id: i, name: name });
        }

        this.tournament = new Tournament(tournamentName, participants);
        this.bracket = new Bracket(this.tournament);
        
        document.getElementById('tournament-title').textContent = tournamentName;
        
        this.showSection('tournament-section');
        this.currentRound = 0;
        this.displayCurrentRound();
    }

    navigateRound(direction) {
        const newRound = this.currentRound + direction;
        if (newRound >= 0 && newRound < this.tournament.rounds.length) {
            this.currentRound = newRound;
            this.displayCurrentRound();
        }
    }

    displayCurrentRound() {
        this.bracket.displayRound(this.currentRound);
        
        const roundNames = this.tournament.getRoundNames();
        document.getElementById('current-round-display').textContent = roundNames[this.currentRound];
        
        // Update navigation buttons
        document.getElementById('prev-round').disabled = this.currentRound === 0;
        document.getElementById('next-round').disabled = this.currentRound === this.tournament.rounds.length - 1;
        
        // Check if tournament is complete
        if (this.tournament.isComplete()) {
            const winner = this.tournament.getWinner();
            document.getElementById('winner-name').textContent = winner.name;
            document.getElementById('winner-section').classList.remove('hidden');
        }
    }

    resetTournament() {
        if (confirm('Yakin ingin reset tournament?')) {
            this.showSection('setup-section');
            document.getElementById('winner-section').classList.add('hidden');
        }
    }

    exportResults() {
        const results = this.tournament.getResults();
        const jsonData = JSON.stringify(results, null, 2);
        
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tournament.name}_results.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new TournamentApp();
});