// Drag and Drop Functionality for Pokemon Team Builder

class DragDropManager {
    constructor(teamBuilder) {
        this.teamBuilder = teamBuilder;
        this.draggedPokemon = null;
        this.draggedElement = null;
        this.dragSourceIndex = -1;
        this.dragSourceType = null; // 'list' or 'team'
        
        this.init();
    }
    
    init() {
        // Initialize drag and drop for Pokemon list
        this.initPokemonListDraggable();
        
        // Initialize drag and drop for team slots
        this.initTeamSlotsDraggable();
        
        // Initialize drop zones
        this.initDropZones();
    }
    
    // Make Pokemon in the list draggable
    initPokemonListDraggable() {
        const pokemonCards = document.querySelectorAll('#pokemon-list .pokemon-card');
        
        pokemonCards.forEach(card => {
            card.setAttribute('draggable', 'true');
            
            card.addEventListener('dragstart', (e) => {
                this.handleDragStart(e, 'list');
                
                // Get the Pokemon data
                const pokemonName = card.querySelector('.pokemon-name').textContent;
                const pokemon = this.teamBuilder.pokemonDataManager.getPokemonByName(pokemonName);
                this.draggedPokemon = pokemon;
                this.draggedElement = card;
            });
            
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    }
    
    // Make team slots draggable
    initTeamSlotsDraggable() {
        const teamSlots = document.querySelectorAll('#team-container .team-slot.filled');
        
        teamSlots.forEach((slot, index) => {
            slot.setAttribute('draggable', 'true');
            
            slot.addEventListener('dragstart', (e) => {
                this.handleDragStart(e, 'team');
                this.dragSourceIndex = index;
                this.draggedPokemon = this.teamBuilder.currentTeam[index];
                this.draggedElement = slot;
            });
            
            slot.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    }
    
    // Initialize drop zones
    initDropZones() {
        // Team slots as drop zones
        const teamContainer = document.getElementById('team-container');
        if (teamContainer) {
            // Add container-level event listeners
            teamContainer.addEventListener('dragover', this.handleDragOver.bind(this));
            teamContainer.addEventListener('dragleave', this.handleDragLeave.bind(this));
            teamContainer.addEventListener('drop', this.handleDrop.bind(this));
            
            // Add individual slot event listeners
            const teamSlots = teamContainer.querySelectorAll('.team-slot');
            teamSlots.forEach((slot, index) => {
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    slot.classList.add('drag-over');
                });
                
                slot.addEventListener('dragleave', () => {
                    slot.classList.remove('drag-over');
                });
                
                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('drag-over');
                    
                    if (this.dragSourceType === 'list') {
                        // Adding from list to team
                        if (this.draggedPokemon) {
                            this.teamBuilder.addPokemonToTeam(this.draggedPokemon);
                        }
                    } else if (this.dragSourceType === 'team') {
                        // Reordering within team
                        this.reorderTeam(this.dragSourceIndex, index);
                    }
                });
            });
        }
    }
    
    // Handle drag start event
    handleDragStart(e, sourceType) {
        this.dragSourceType = sourceType;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'pokemon-drag'); // Required for Firefox
        
        // Add dragging class
        e.target.classList.add('dragging');
        
        // Create a custom drag image (optional)
        if (this.draggedPokemon) {
            const dragImage = document.createElement('div');
            dragImage.className = 'drag-image';
            dragImage.innerHTML = `<img src="${this.draggedPokemon.sprite}" alt="${this.draggedPokemon.nameEn}" width="50">`;
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 25, 25);
            
            // Remove the element after drag starts
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        }
    }
    
    // Handle drag over event
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    // Handle drag leave event
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }
    
    // Handle drop event
    handleDrop(e) {
        e.preventDefault();
        
        // Remove drag-over class from all elements
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        
        return false;
    }
    
    // Handle drag end event
    handleDragEnd() {
        // Remove dragging class
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
        }
        
        // Reset drag state
        this.draggedPokemon = null;
        this.draggedElement = null;
        this.dragSourceIndex = -1;
        this.dragSourceType = null;
        
        // Remove drag-over class from all elements
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }
    
    // Reorder team Pokemon
    reorderTeam(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        // Get the current team
        const team = this.teamBuilder.currentTeam;
        
        // Perform the reordering
        const [removed] = team.splice(fromIndex, 1);
        team.splice(toIndex, 0, removed);
        
        // Update the UI
        this.teamBuilder.updateTeamDisplay();
        this.teamBuilder.updateTypeAnalysis();
    }
    
    // Refresh draggable elements after DOM updates
    refresh() {
        this.init();
    }
}

export default DragDropManager;