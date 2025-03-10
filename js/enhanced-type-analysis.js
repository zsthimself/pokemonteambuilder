// Enhanced Type Analysis Module

class EnhancedTypeAnalyzer {
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

    // Get weaknesses, resistances and immunities
    getTypeCategories(weaknesses) {
        const categories = {
            weaknesses: [],
            resistances: [],
            immunities: []
        };
        
        Object.entries(weaknesses).forEach(([type, value]) => {
            if (value >= 2) {
                categories.weaknesses.push({
                    type: type,
                    value: value
                });
            } else if (value === 0) {
                categories.immunities.push({
                    type: type
                });
            } else if (value < 1) {
                categories.resistances.push({
                    type: type,
                    value: value
                });
            }
        });
        
        // Sort by effectiveness
        categories.weaknesses.sort((a, b) => b.value - a.value);
        categories.resistances.sort((a, b) => a.value - b.value);
        
        return categories;
    }

    // Render the enhanced type analysis to HTML
    renderEnhancedTypeAnalysis(weaknesses, container) {
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
        
        // Create team composition analysis
        const compositionElement = document.createElement('div');
        compositionElement.className = 'team-composition';
        
        // Get categorized types
        const categories = this.getTypeCategories(weaknesses);
        
        // Create composition stats
        const statsHTML = `
            <div class="composition-title">Team Composition Analysis</div>
            <div class="composition-stats">
                <div class="stat-item">
                    <div class="stat-value">${categories.weaknesses.length}</div>
                    <div class="stat-label">Weaknesses</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${categories.resistances.length}</div>
                    <div class="stat-label">Resistances</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${categories.immunities.length}</div>
                    <div class="stat-label">Immunities</div>
                </div>
            </div>
        `;
        
        // Create weakness summary
        let weaknessHTML = '';
        if (categories.weaknesses.length > 0) {
            weaknessHTML = `
                <div class="weakness-summary">
                    <div class="weakness-title">Weaknesses</div>
                    <div class="weakness-badges">
                        ${categories.weaknesses.map(w => `
                            <div class="weakness-badge type-${w.type}">
                                ${w.type} ${w.value === 4 ? '(4x)' : '(2x)'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Create resistance summary
        let resistanceHTML = '';
        if (categories.resistances.length > 0) {
            resistanceHTML = `
                <div class="weakness-summary">
                    <div class="weakness-title">Resistances</div>
                    <div class="weakness-badges">
                        ${categories.resistances.map(r => `
                            <div class="resistance-badge type-${r.type}">
                                ${r.type} ${r.value === 0.25 ? '(0.25x)' : '(0.5x)'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Create immunity summary
        let immunityHTML = '';
        if (categories.immunities.length > 0) {
            immunityHTML = `
                <div class="weakness-summary">
                    <div class="weakness-title">Immunities</div>
                    <div class="weakness-badges">
                        ${categories.immunities.map(i => `
                            <div class="immunity-badge type-${i.type}">
                                ${i.type}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        compositionElement.innerHTML = statsHTML + weaknessHTML + resistanceHTML + immunityHTML;
        container.appendChild(compositionElement);
        
        // Create detailed type chart
        const typeChartElement = document.createElement('div');
        typeChartElement.className = 'type-chart-container';
        typeChartElement.innerHTML = `
            <div class="type-chart-title">Detailed Type Effectiveness</div>
            <div class="type-chart-grid">
                ${this.allTypes.map(type => {
                    const effectiveness = weaknesses[type] || 1;
                    return `
                        <div class="type-chart-cell ${this.getEffectivenessClass(effectiveness)}">
                            <div class="type-badge type-${type}">${type}</div>
                            <div class="effectiveness-value">${effectiveness}x</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="type-chart-legend">
                <div class="legend-item">
                    <div class="legend-color effectiveness-0"></div>
                    <span>Immune (0x)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color effectiveness-0-25"></div>
                    <span>Very Resistant (0.25x)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color effectiveness-0-5"></div>
                    <span>Resistant (0.5x)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color effectiveness-1"></div>
                    <span>Normal (1x)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color effectiveness-2"></div>
                    <span>Weak (2x)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color effectiveness-4"></div>
                    <span>Very Weak (4x)</span>
                </div>
            </div>
        `;
        container.appendChild(typeChartElement);
    }
}

// Export the EnhancedTypeAnalyzer class
export default EnhancedTypeAnalyzer;