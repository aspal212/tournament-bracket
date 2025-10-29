class Bracket {
    constructor(tournament) {
        this.tournament = tournament;
        this.container = document.getElementById('bracket-container');
    }

    displayRound(roundIndex) {
        this.container.innerHTML = '';
        
        const round = this.tournament.rounds[roundIndex];
        const roundNames = this.tournament.getRoundNames();
        
        const bracketDiv = document.createElement('div');
        bracketDiv.className = 'bracket';
        
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        
        const roundTitle = document.createElement('h3');
        roundTitle.textContent = roundNames[roundIndex];
        roundDiv.appendChild(roundTitle);
        
        round.forEach((match, matchIndex) => {
            const matchElement = this.createMatchElement(match, roundIndex, matchIndex);
            roundDiv.appendChild(matchElement);
        });
        
        bracketDiv.appendChild(roundDiv);
        this.container.appendChild(bracketDiv);
    }

    createMatchElement(match, roundIndex, matchIndex) {
        const matchDiv = document.createElement('div');
        matchDiv.className = `match ${match.winner ? 'completed' : ''}`;
        
        const matchNumber = document.createElement('div');
        matchNumber.className = 'match-number';
        matchNumber.textContent = `Match ${matchIndex + 1}`;
        matchDiv.appendChild(matchNumber);
        
        if (match.participants.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'participant empty-slot';
            emptyDiv.textContent = 'Menunggu peserta...';
            matchDiv.appendChild(emptyDiv);
        } else {
            match.participants.forEach(participant => {
                const participantDiv = this.createParticipantElement(
                    participant, 
                    match, 
                    roundIndex, 
                    matchIndex
                );
                matchDiv.appendChild(participantDiv);
            });
            
            // Add empty slot if only one participant
            if (match.participants.length === 1) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'participant empty-slot';
                emptyDiv.textContent = 'Menunggu lawan...';
                matchDiv.appendChild(emptyDiv);
            }
        }
        
        return matchDiv;
    }

    createParticipantElement(participant, match, roundIndex, matchIndex) {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant';
        
        if (match.winner && match.winner.id === participant.id) {
            participantDiv.classList.add('winner');
        }
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'participant-name';
        nameSpan.textContent = participant.name;
        participantDiv.appendChild(nameSpan);
        
        // Add click handler for selecting winner
        if (match.participants.length === 2 && !match.winner) {
            participantDiv.style.cursor = 'pointer';
            participantDiv.addEventListener('click', () => {
                this.selectWinner(participant, roundIndex, matchIndex);
            });
            
            participantDiv.addEventListener('mouseenter', () => {
                participantDiv.classList.add('selected');
            });
            
            participantDiv.addEventListener('mouseleave', () => {
                participantDiv.classList.remove('selected');
            });
        }
        
        return participantDiv;
    }

    selectWinner(winner, roundIndex, matchIndex) {
        if (confirm(`Pilih ${winner.name} sebagai pemenang?`)) {
            this.tournament.advanceWinner(roundIndex, matchIndex, winner);
            
            // Refresh display
            this.displayRound(roundIndex);
            
            // Auto advance to next round if current round is complete
            if (this.isRoundComplete(roundIndex)) {
                setTimeout(() => {
                    if (roundIndex < this.tournament.rounds.length - 1) {
                        // Auto navigate to next round
                        document.getElementById('next-round').click();
                    }
                }, 1000);
            }
        }
    }

    isRoundComplete(roundIndex) {
        const round = this.tournament.rounds[roundIndex];
        return round.every(match => match.winner !== null);
    }
}