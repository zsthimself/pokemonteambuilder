// Team Builder Module

class TeamBuilder {
    constructor(pokemonDataManager, typeAnalyzer) {
        this.pokemonDataManager = pokemonDataManager;
        this.typeAnalyzer = typeAnalyzer;
        this.currentTeam = [];
        this.maxTeamSize = 6;
        
        // DOM elements
        this.teamContainer = document.getElementById('team-container');
        this.typeAnalysisContainer = document.getElementById('type-analysis');
        this.clearTeamButton = document.getElementById('clear-team');
        this.saveTeamButton = document.getElementById('save-team');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load saved teams
        this.loadSavedTeams();
    }
    
    initEventListeners() {
        // Clear team button
        if (this.clearTeamButton) {
            this.clearTeamButton.addEventListener('click', () => this.clearTeam());
        }
        
        // Save team button
        if (this.saveTeamButton) {
            this.saveTeamButton.addEventListener('click', () => this.openSaveTeamModal());
        }
        
        // Save team confirmation
        const confirmSaveButton = document.getElementById('confirm-save');
        if (confirmSaveButton) {
            confirmSaveButton.addEventListener('click', () => this.saveTeam());
        }
    }
    
    // Add Pokemon to team
    addPokemonToTeam(pokemon) {
        if (this.currentTeam.length >= this.maxTeamSize) {
            alert('Your team is already full! Remove a Pokemon before adding a new one.');
            return false;
        }
        
        this.currentTeam.push(pokemon);
        this.updateTeamDisplay();
        this.updateTypeAnalysis();
        return true;
    }
    
    // Remove Pokemon from team
    removePokemonFromTeam(index) {
        if (index >= 0 && index < this.currentTeam.length) {
            this.currentTeam.splice(index, 1);
            this.updateTeamDisplay();
            this.updateTypeAnalysis();
            return true;
        }
        return false;
    }
    
    // Clear the entire team
    clearTeam() {
        this.currentTeam = [];
        this.updateTeamDisplay();
        this.updateTypeAnalysis();
    }
    
    // Update the team display in the UI
    updateTeamDisplay() {
        if (!this.teamContainer) return;
        
        // Clear the container
        this.teamContainer.innerHTML = '';
        
        // Create slots for each potential team member (up to maxTeamSize)
        for (let i = 0; i < this.maxTeamSize; i++) {
            const pokemon = i < this.currentTeam.length ? this.currentTeam[i] : null;
            const slotElement = document.createElement('div');
            slotElement.className = 'col';
            
            if (pokemon) {
                // Filled slot with Pokemon
                slotElement.innerHTML = `
                    <div class="team-slot filled">
                        <div class="team-pokemon">
                            <img src="${pokemon.sprite}" alt="${pokemon.nameEn}" class="img-fluid">
                            <div class="pokemon-info">
                                <div class="pokemon-name">${pokemon.nameEn}</div>
                                <div class="pokemon-types">
                                    ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
                                </div>
                            </div>
                            <div class="remove-pokemon" data-index="${i}" title="Remove from team">×</div>
                        </div>
                    </div>
                `;
                
                // Add event listener to remove button
                const removeButton = slotElement.querySelector('.remove-pokemon');
                if (removeButton) {
                    removeButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // 防止冒泡触发其他事件
                        const index = parseInt(e.target.getAttribute('data-index'));
                        this.removePokemonFromTeam(index);
                    });
                }
            } else {
                // Empty slot
                slotElement.innerHTML = `
                    <div class="team-slot">
                        <div class="empty-slot-content">
                            <div class="empty-slot-icon">+</div>
                            <div class="text-muted">Empty Slot</div>
                        </div>
                    </div>
                `;
            }
            
            this.teamContainer.appendChild(slotElement);
        }
    }
    
    // Update the type analysis display
    updateTypeAnalysis() {
        if (!this.typeAnalysisContainer || !this.typeAnalyzer) return;
        
        const weaknesses = this.typeAnalyzer.calculateTeamWeaknesses(this.currentTeam);
        
        // Check if enhanced type analyzer is available
        if (typeof EnhancedTypeAnalyzer !== 'undefined') {
            // Use enhanced type analysis if available
            const enhancedAnalyzer = new EnhancedTypeAnalyzer(this.typeAnalyzer.typeChart);
            enhancedAnalyzer.renderEnhancedTypeAnalysis(weaknesses, this.typeAnalysisContainer);
        } else {
            // Fall back to basic type analysis
            this.typeAnalyzer.renderTypeAnalysis(weaknesses, this.typeAnalysisContainer);
        }
    }
    
    // Open the save team modal
    openSaveTeamModal() {
        if (this.currentTeam.length === 0) {
            alert('Please add at least one Pokemon to your team before saving.');
            return;
        }
        
        const modal = new bootstrap.Modal(document.getElementById('save-team-modal'));
        modal.show();
    }
    
    // Save the current team
    saveTeam() {
        const teamNameInput = document.getElementById('team-name');
        const teamDescriptionInput = document.getElementById('team-description');
        const teamName = teamNameInput ? teamNameInput.value.trim() : '';
        const teamDescription = teamDescriptionInput ? teamDescriptionInput.value.trim() : '';
        
        if (!teamName) {
            alert('Please enter a name for your team.');
            return;
        }
        
        // Create team object
        const team = {
            name: teamName,
            description: teamDescription,
            created: new Date().toISOString(),
            pokemon: this.currentTeam.map(p => ({
                id: p.id,
                name: p.nameEn,
                types: p.types,
                sprite: p.sprite
            }))
        };
        
        // Save to localStorage
        this.saveTeamToLocalStorage(team);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('save-team-modal'));
        if (modal) {
            modal.hide();
        }
        
        // Reset inputs
        if (teamNameInput) {
            teamNameInput.value = '';
        }
        if (teamDescriptionInput) {
            teamDescriptionInput.value = '';
        }
        
        // Update saved teams display
        this.loadSavedTeams();
    }
    
    // Save team to localStorage
    saveTeamToLocalStorage(team) {
        const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams') || '{}');
        savedTeams[team.name] = team;
        localStorage.setItem('pokemonTeams', JSON.stringify(savedTeams));
    }
    
    // Load teams from localStorage
    loadTeamsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('pokemonTeams') || '{}');
    }
    
    // Load and display saved teams
    loadSavedTeams() {
        const savedTeamsContainer = document.getElementById('saved-teams');
        if (!savedTeamsContainer) return;
        
        // Clear container
        savedTeamsContainer.innerHTML = '';
        
        // Get saved teams
        const savedTeams = this.loadTeamsFromLocalStorage();
        
        // If no saved teams
        if (Object.keys(savedTeams).length === 0) {
            savedTeamsContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No saved teams yet. Build and save your first team!</p></div>';
            return;
        }
        
        // Display each saved team
        Object.values(savedTeams).forEach(team => {
            const teamElement = document.createElement('div');
            teamElement.className = 'col-md-6 col-lg-4 mb-3';
            teamElement.innerHTML = `
                <div class="saved-team-card">
                    <h3 class="h5">${team.name}</h3>
                    ${team.description ? `<p class="team-description">${team.description}</p>` : ''}
                    <div class="saved-team-pokemon">
                        ${team.pokemon.map(p => `
                            <div class="saved-pokemon">
                                <img src="${p.sprite}" alt="${p.name}" width="40" height="40">
                            </div>
                        `).join('')}
                    </div>
                    <div class="saved-team-actions">
                        <button class="btn btn-sm btn-primary load-team" data-team-name="${team.name}">Load</button>
                        <button class="btn btn-sm btn-danger delete-team" data-team-name="${team.name}">Delete</button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const loadButton = teamElement.querySelector('.load-team');
            if (loadButton) {
                loadButton.addEventListener('click', (e) => {
                    const teamName = e.target.getAttribute('data-team-name');
                    this.loadTeam(teamName);
                });
            }
            
            const deleteButton = teamElement.querySelector('.delete-team');
            if (deleteButton) {
                deleteButton.addEventListener('click', (e) => {
                    const teamName = e.target.getAttribute('data-team-name');
                    this.deleteTeam(teamName);
                });
            }
            
            savedTeamsContainer.appendChild(teamElement);
        });
    }
    
    // Load a saved team
    loadTeam(teamName) {
        const savedTeams = this.loadTeamsFromLocalStorage();
        const team = savedTeams[teamName];
        
        if (!team) return;
        
        // Clear current team
        this.clearTeam();
        
        // Load Pokemon data for each team member
        team.pokemon.forEach(pokemonData => {
            const pokemon = this.pokemonDataManager.getPokemonById(pokemonData.id);
            if (pokemon) {
                this.addPokemonToTeam(pokemon);
            }
        });
    }
    
    // Delete a saved team
    deleteTeam(teamName) {
        if (!confirm(`Are you sure you want to delete the team "${teamName}"?`)) {
            return;
        }
        
        const savedTeams = this.loadTeamsFromLocalStorage();
        if (savedTeams[teamName]) {
            delete savedTeams[teamName];
            localStorage.setItem('pokemonTeams', JSON.stringify(savedTeams));
            this.loadSavedTeams();
        }
    }
}

// Export the TeamBuilder class
export default TeamBuilder;