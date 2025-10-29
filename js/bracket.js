class TournamentBracket {
    constructor() {
        this.tournament = {
            name: '',
            players: [],
            bracket: [],
            currentRound: 0,
            winner: null
        };
        this.init();
    }

    init() {
        // Event listeners untuk halaman setup
        if (document.getElementById('generateInputs')) {
            document.getElementById('generateInputs').addEventListener('click', () => this.generatePlayerInputs());
            document.getElementById('createBracket').addEventListener('click', () => this.createBracket());
            document.getElementById('loadExample').addEventListener('click', () => this.loadExample());
            document.getElementById('playerCount').addEventListener('change', () => this.generatePlayerInputs());
        }

        // Event listeners untuk halaman bracket
        if (document.getElementById('resetTournament')) {
            document.getElementById('resetTournament').addEventListener('click', () => this.resetTournament());
            document.getElementById('backToSetup').addEventListener('click', () => window.location.href = 'index.html');
            this.loadTournament();
        }

        // Auto-generate inputs on page load
        if (document.getElementById('generateInputs')) {
            this.generatePlayerInputs();
        }
    }

    generatePlayerInputs() {
        const count = parseInt(document.getElementById('playerCount').value);
        const container = document.getElementById('playerInputs');
        
        container.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'player-input';
            inputDiv.innerHTML = `
                <input type="text" id="player${i}" placeholder="Nama Peserta ${i}" required>
            `;
            container.appendChild(inputDiv);
        }

        // Enable create bracket button when inputs are generated
        document.getElementById('createBracket').disabled = false;
    }

    createBracket() {
        const tournamentName = document.getElementById('tournamentName').value;
        const playerCount = parseInt(document.getElementById('playerCount').value);
        
        if (!tournamentName) {
            alert('Mohon isi nama tournament!');
            return;
        }

        const players = [];
        for (let i = 1; i <= playerCount; i++) {
            const playerName = document.getElementById(`player${i}`).value.trim();
            if (!playerName) {
                alert(`Mohon isi nama peserta ${i}!`);
                return;
            }
            players.push({
                id: i,
                name: playerName,
                eliminated: false
            });
        }

        // Shuffle players for random bracket
        this.shuffleArray(players);

        this.tournament = {
            name: tournamentName,
            players: players,
            bracket: this.generateBracket(players),
            currentRound: 0,
            winner: null
        };

        // Save to localStorage
        localStorage.setItem('tournament', JSON.stringify(this.tournament));

        // Redirect to bracket page
        window.location.href = 'bracket.html';
    }

    generateBracket(players) {
        const bracket = [];
        let currentPlayers = [...players];
        let roundNumber = 1;

        while (currentPlayers.length > 1) {
            const matches = [];
            
            for (let i = 0; i < currentPlayers.length; i += 2) {
                if (i + 1 < currentPlayers.length) {
                    matches.push({
                        id: `round${roundNumber}_match${Math.floor(i/2) + 1}`,
                        player1: currentPlayers[i],
                        player2: currentPlayers[i + 1],
                        winner: null,
                        completed: false
                    });
                } else {
                    // Bye (player advances automatically)
                    matches.push({
                        id: `round${roundNumber}_match${Math.floor(i/2) + 1}`,
                        player1: currentPlayers[i],
                        player2: null,
                        winner: currentPlayers[i],
                        completed: true,
                        isBye: true
                    });
                }
            }

            bracket.push({
                roundNumber: roundNumber,
                roundName: this.getRoundName(roundNumber, bracket.length + 1),
                matches: matches
            });

            // Prepare next round
            currentPlayers = matches.map(match => match.winner).filter(winner => winner !== null);
            roundNumber++;
        }

        return bracket;
    }

    getRoundName(roundNumber, totalRounds) {
        if (totalRounds === 1) return 'Final';
        if (totalRounds === 2) return roundNumber === 1 ? 'Semifinal' : 'Final';
        if (totalRounds === 3) return ['Perempat Final', 'Semifinal', 'Final'][roundNumber - 1];
        if (totalRounds === 4) return ['Babak 16 Besar', 'Perempat Final', 'Semifinal', 'Final'][roundNumber - 1];
        if (totalRounds === 5) return ['Babak 32 Besar', 'Babak 16 Besar', 'Perempat Final', 'Semifinal', 'Final'][roundNumber - 1];
        return `Round ${roundNumber}`;
    }

    loadTournament() {
        const saved = localStorage.getItem('tournament');
        if (!saved) {
            window.location.href = 'index.html';
            return;
        }

        this.tournament = JSON.parse(saved);
        this.displayBracket();
    }

    displayBracket() {
        document.getElementById('tournamentTitle').textContent = this.tournament.name;
        
        const container = document.getElementById('bracketContainer');
        container.innerHTML = '<div class="bracket"></div>';
        
        const bracketDiv = container.querySelector('.bracket');

        this.tournament.bracket.forEach((round, roundIndex) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            roundDiv.innerHTML = `<div class="round-title">${round.roundName}</div>`;

            round.matches.forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = `match ${match.completed ? 'completed' : ''}`;
                matchDiv.innerHTML = this.generateMatchHTML(match, roundIndex);
                roundDiv.appendChild(matchDiv);
            });

            bracketDiv.appendChild(roundDiv);
        });

        // Check if tournament is completed
        this.checkTournamentCompletion();
    }

    generateMatchHTML(match, roundIndex) {
        if (match.isBye) {
            return `
                <div class="player winner">
                    <span class="player-name">${match.player1.name}</span>
                </div>
                <div class="match-info">Bye</div>
            `;
        }

        return `
            <div class="player ${match.winner && match.winner.id === match.player1.id ? 'winner' : match.completed ? 'eliminated' : ''}" 
                 onclick="tournamentApp.selectWinner('${match.id}', ${match.player1.id})">
                <span class="player-name">${match.player1.name}</span>
            </div>
            <div class="player ${match.winner && match.winner.id === match.player2.id ? 'winner' : match.completed ? 'eliminated' : ''}" 
                 onclick="tournamentApp.selectWinner('${match.id}', ${match.player2.id})">
                <span class="player-name">${match.player2.name}</span>
            </div>
            <div class="match-info">
                ${match.completed ? 'Selesai' : 'Klik peserta untuk menentukan pemenang'}
            </div>
        `;
    }

    selectWinner(matchId, playerId) {
        // Find the match
        let targetMatch = null;
        let roundIndex = -1;

        for (let i = 0; i < this.tournament.bracket.length; i++) {
            const match = this.tournament.bracket[i].matches.find(m => m.id === matchId);
            if (match) {
                targetMatch = match;
                roundIndex = i;
                break;
            }
        }

        if (!targetMatch || targetMatch.completed) return;

        // Set winner
        const winner = playerId === targetMatch.player1.id ? targetMatch.player1 : targetMatch.player2;
        targetMatch.winner = winner;
        targetMatch.completed = true;

        // Update next round
        this.updateNextRound(roundIndex, targetMatch);

        // Save and refresh display
        localStorage.setItem('tournament', JSON.stringify(this.tournament));
        this.displayBracket();
    }

    updateNextRound(completedRoundIndex, completedMatch) {
        if (completedRoundIndex + 1 >= this.tournament.bracket.length) return;

        const nextRound = this.tournament.bracket[completedRoundIndex + 1];
        const matchNumber = parseInt(completedMatch.id.split('_match')[1]);
        const nextMatchIndex = Math.floor((matchNumber - 1) / 2);

        if (nextRound.matches[nextMatchIndex]) {
            const nextMatch = nextRound.matches[nextMatchIndex];
            
            if ((matchNumber - 1) % 2 === 0) {
                // Even match number -> goes to player1 slot
                nextMatch.player1 = completedMatch.winner;
            } else {
                // Odd match number -> goes to player2 slot
                nextMatch.player2 = completedMatch.winner;
            }
        }
    }

    checkTournamentCompletion() {
        const finalRound = this.tournament.bracket[this.tournament.bracket.length - 1];
        const finalMatch = finalRound.matches[0];

        if (finalMatch && finalMatch.completed) {
            this.tournament.winner = finalMatch.winner;
            document.getElementById('winnerSection').style.display = 'block';
            document.getElementById('winnerName').textContent = finalMatch.winner.name;
        }
    }

    loadExample() {
        document.getElementById('tournamentName').value = 'Badminton Championship 2024';
        document.getElementById('playerCount').value = '8';
        this.generatePlayerInputs();

        const exampleNames = [
            'Ahmad Pratama', 'Budi Santoso', 'Citra Dewi', 'Dian Kusuma',
            'Eko Prasetyo', 'Fani Sari', 'Gita Permata', 'Hendra Wijaya'
        ];

        exampleNames.forEach((name, index) => {
            document.getElementById(`player${index + 1}`).value = name;
        });
    }

    resetTournament() {
        if (confirm('Yakin ingin reset tournament? Semua data akan hilang.')) {
            localStorage.removeItem('tournament');
            window.location.href = 'index.html';
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize the app
const tournamentApp = new TournamentBracket();
