class Tournament {
    constructor(name, participants) {
        this.name = name;
        this.participants = participants;
        this.rounds = [];
        this.generateBracket();
    }

    generateBracket() {
        // Shuffle participants untuk random seeding
        const shuffled = [...this.participants].sort(() => Math.random() - 0.5);
        
        let currentRound = shuffled.map((p, index) => ({
            id: `match-${0}-${Math.floor(index/2)}`,
            participants: index % 2 === 0 ? [p] : [],
            winner: null
        }));

        // Group participants into matches
        const firstRoundMatches = [];
        for (let i = 0; i < shuffled.length; i += 2) {
            firstRoundMatches.push({
                id: `match-0-${firstRoundMatches.length}`,
                participants: [shuffled[i], shuffled[i + 1]],
                winner: null
            });
        }

        this.rounds.push(firstRoundMatches);

        // Generate subsequent rounds
        let roundNumber = 1;
        let previousRoundSize = firstRoundMatches.length;

        while (previousRoundSize > 1) {
            const nextRoundSize = Math.floor(previousRoundSize / 2);
            const nextRound = [];

            for (let i = 0; i < nextRoundSize; i++) {
                nextRound.push({
                    id: `match-${roundNumber}-${i}`,
                    participants: [],
                    winner: null
                });
            }

            this.rounds.push(nextRound);
            roundNumber++;
            previousRoundSize = nextRoundSize;
        }
    }

    advanceWinner(roundIndex, matchIndex, winner) {
        const match = this.rounds[roundIndex][matchIndex];
        match.winner = winner;

        // Advance to next round
        if (roundIndex < this.rounds.length - 1) {
            const nextRoundMatchIndex = Math.floor(matchIndex / 2);
            const nextMatch = this.rounds[roundIndex + 1][nextRoundMatchIndex];
            
            if (nextMatch.participants.length < 2) {
                nextMatch.participants.push(winner);
            } else {
                // Replace if position already filled
                const position = matchIndex % 2;
                nextMatch.participants[position] = winner;
            }

            // Clear winner from next match if participants changed
            nextMatch.winner = null;
        }
    }

    getRoundNames() {
        const totalRounds = this.rounds.length;
        const names = [];
        
        for (let i = 0; i < totalRounds; i++) {
            if (i === totalRounds - 1) {
                names.push('Final');
            } else if (i === totalRounds - 2) {
                names.push('Semi Final');
            } else if (i === totalRounds - 3) {
                names.push('Perempat Final');
            } else {
                names.push(`Round ${i + 1}`);
            }
        }
        
        return names;
    }

    isComplete() {
        const finalMatch = this.rounds[this.rounds.length - 1][0];
        return finalMatch.winner !== null;
    }

    getWinner() {
        if (this.isComplete()) {
            return this.rounds[this.rounds.length - 1][0].winner;
        }
        return null;
    }

    getResults() {
        return {
            tournamentName: this.name,
            participants: this.participants,
            rounds: this.rounds,
            winner: this.getWinner(),
            completedAt: this.isComplete() ? new Date().toISOString() : null
        };
    }
}