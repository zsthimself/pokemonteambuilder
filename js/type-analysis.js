// Type Analysis Module

class TypeAnalyzer {
    constructor(typeChart) {
        this.typeChart = typeChart || {};
        this.allTypes = [
            'normal', 'fire', 'water', 'electric', 'grass',
            'ice', 'fighting', 'poison', 'ground', 'flying',
            'psychic', 'bug', 'rock', 'ghost', 'dragon',
            'dark', 'steel', 'fairy'
        ];
    }

    // Calculate team weaknesses and resistances
    calculateTeamWeaknesses(team) {
        // Initialize all types with effectiveness of 1
        const weaknesses = {};
        this.allTypes.forEach(type => {
            weaknesses[type] = 1;
        });
        
        // Skip calculation if team is empty
        if (!team || team.length === 0) {
            return weaknesses;
        }

        // For each Pokemon in the team
        team.forEach(pokemon => {
            if (!pokemon || !pokemon.types) return;
            
            // For each type of the Pokemon
            pokemon.types.forEach(type => {
                // Get effectiveness against this type
                const typeEffectiveness = this.typeChart[type] || {};
                
                // Update the team's overall type effectiveness
                Object.keys(typeEffectiveness).forEach(againstType => {
                    weaknesses[againstType] *= typeEffectiveness[againstType];
                });
            });
        });
        
        return weaknesses;
    }

    // Get effectiveness class for CSS styling
    getEffectivenessClass(value) {
        if (value === 0) return 'effectiveness-0';
        if (value === 0.25) return 'effectiveness-0-25';
        if (value === 0.5) return 'effectiveness-0-5';
        if (value === 1) return 'effectiveness-1';
        if (value === 2) return 'effectiveness-2';
        if (value === 4) return 'effectiveness-4';
        return 'effectiveness-1';
    }

    // Get text description of effectiveness
    getEffectivenessText(value) {
        if (value === 0) return 'Immune';
        if (value === 0.25) return 'Very Resistant';
        if (value === 0.5) return 'Resistant';
        if (value === 1) return 'Normal';
        if (value === 2) return 'Weak';
        if (value === 4) return 'Very Weak';
        return 'Normal';
    }

    // Calculate a simple team score based on weaknesses
    calculateTeamScore(weaknesses) {
        if (!weaknesses) return 0;
        
        let score = 100; // Start with perfect score
        
        // Count severe weaknesses (2x or 4x)
        const severeWeaknesses = Object.values(weaknesses).filter(v => v >= 2).length;
        
        // Count immunities and resistances
        const resistances = Object.values(weaknesses).filter(v => v < 1 && v > 0).length;
        const immunities = Object.values(weaknesses).filter(v => v === 0).length;
        
        // Adjust score
        score -= severeWeaknesses * 5; // Deduct 5 points for each severe weakness
        score += resistances * 2;      // Add 2 points for each resistance
        score += immunities * 3;       // Add 3 points for each immunity
        
        // Ensure score is between 0 and 100
        return Math.max(0, Math.min(100, score));
    }

    // Render the type analysis to HTML
    renderTypeAnalysis(weaknesses, container) {
        if (!container) return;
        
        // Clear the container
        container.innerHTML = '';
        
        // Create score element
        const score = this.calculateTeamScore(weaknesses);
        const scoreElement = document.createElement('div');
        scoreElement.className = 'team-score mb-3';
        scoreElement.innerHTML = `
            <h3>Team Score: ${score}/100</h3>
            <div class="progress">
                <div class="progress-bar ${score >= 70 ? 'bg-success' : score >= 40 ? 'bg-warning' : 'bg-danger'}" 
                     role="progressbar" style="width: ${score}%" 
                     aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">
                </div>
            </div>
        `;
        container.appendChild(scoreElement);
        
        // Create type analysis grid
        const gridElement = document.createElement('div');
        gridElement.className = 'type-analysis-grid';
        
        // Add each type to the grid
        this.allTypes.forEach(type => {
            const effectiveness = weaknesses[type] || 1;
            const typeElement = document.createElement('div');
            typeElement.className = `type-analysis-item ${this.getEffectivenessClass(effectiveness)}`;
            typeElement.innerHTML = `
                <div class="type-badge type-${type}">${type}</div>
                <div class="effectiveness-value">${this.getEffectivenessText(effectiveness)}</div>
            `;
            gridElement.appendChild(typeElement);
        });
        
        container.appendChild(gridElement);
    }
}

// Export the TypeAnalyzer class
export default TypeAnalyzer;