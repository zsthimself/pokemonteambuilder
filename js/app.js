// Main Application Entry

import pokemonDataManager from './pokemon-data.js';
import TypeAnalyzer from './type-analysis.js';
import TeamBuilder from './team-builder.js';
import DragDropManager from './drag-drop.js';
import AutocompleteSearch from './autocomplete-search.js';
import LoadingIndicator from './loading-indicator.js';
import PaginationManager from './pagination.js';

class App {
    constructor() {
        this.pokemonDataManager = pokemonDataManager;
        this.typeAnalyzer = null;
        this.teamBuilder = null;
        this.dragDropManager = null;
        this.autocompleteSearch = null;
        this.paginationManager = new PaginationManager(12); // 每页显示12个宝可梦
        this.pokemonListContainer = document.getElementById('pokemon-list');
        this.typeFilterSelect = document.getElementById('type-filter');
        this.searchInput = document.getElementById('pokemon-search');
        this.generationFilterSelect = document.getElementById('generation-filter');
        this.statTypeSelect = document.getElementById('stat-type-filter');
        this.statValueInput = document.getElementById('stat-value-filter');
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading indicator
            LoadingIndicator.show('Loading Pokemon data...');
            
            // Load Pokemon data and type chart
            await this.loadData();
            
            // Initialize modules
            this.initializeModules();
            
            // Initialize pagination
            this.initializePagination();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initial render
            this.renderPokemonList();
            this.populateTypeFilter();
            this.populateGenerationFilter();
            
            // Hide loading indicator
            LoadingIndicator.hide();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize the application. Please try refreshing the page.');
            LoadingIndicator.hide();
        }
    }
    
    initializePagination() {
        // Initialize pagination with DOM elements
        const paginationControls = document.getElementById('pagination-controls');
        const paginationInfo = document.getElementById('pagination-info');
        
        if (paginationControls && paginationInfo) {
            this.paginationManager.init(paginationControls, paginationInfo);
        }
    }
    
    async loadData() {
        // Load Pokemon data
        await this.pokemonDataManager.loadPokemonData();
        
        // Load type chart and initialize type analyzer
        const typeChart = await this.pokemonDataManager.loadTypeChart();
        this.typeAnalyzer = new TypeAnalyzer(typeChart);
    }
    
    initializeModules() {
        // Initialize team builder
        this.teamBuilder = new TeamBuilder(this.pokemonDataManager, this.typeAnalyzer);
        
        // Initialize drag and drop functionality
        this.dragDropManager = new DragDropManager(this.teamBuilder);
        
        // Initialize autocomplete search
        this.autocompleteSearch = new AutocompleteSearch(this.pokemonDataManager);
    }
    
    setupEventListeners() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.renderPokemonList();
            });
        }
        
        // Type filter
        if (this.typeFilterSelect) {
            this.typeFilterSelect.addEventListener('change', () => {
                this.renderPokemonList();
            });
        }
    }
    
    renderPokemonList() {
        if (!this.pokemonListContainer) return;
        
        // Clear container
        this.pokemonListContainer.innerHTML = '';
        
        // Get filters
        const filters = {
            name: this.searchInput ? this.searchInput.value : '',
            type: this.typeFilterSelect ? this.typeFilterSelect.value : '',
            generation: this.generationFilterSelect ? this.generationFilterSelect.value : '',
            statType: this.statTypeSelect ? this.statTypeSelect.value : '',
            statValue: this.statValueInput ? this.statValueInput.value : ''
        };
        
        // Filter Pokemon
        const filteredPokemon = this.pokemonDataManager.filterPokemon(filters);
        
        // Update pagination with total items
        this.paginationManager.setTotalItems(filteredPokemon.length);
        
        // Get paginated items
        const paginatedPokemon = this.paginationManager.getPaginatedItems(filteredPokemon);
        
        // Render each Pokemon in current page
        paginatedPokemon.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'col';
            pokemonElement.innerHTML = `
                <div class="pokemon-card">
                    <img src="${pokemon.sprite}" alt="${pokemon.nameEn}" class="img-fluid">
                    <div class="pokemon-name">${pokemon.nameEn}</div>
                    <div class="pokemon-types">
                        ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Add click event to add Pokemon to team
            pokemonElement.querySelector('.pokemon-card').addEventListener('click', () => {
                this.teamBuilder.addPokemonToTeam(pokemon);
            });
            
            this.pokemonListContainer.appendChild(pokemonElement);
        });
        
        // Refresh drag and drop after rendering new Pokemon cards
        if (this.dragDropManager) {
            this.dragDropManager.refresh();
        }
        
        // Show message if no results
        if (filteredPokemon.length === 0) {
            this.pokemonListContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No Pokemon found matching your criteria.</p></div>';
        }
        
        // Render pagination controls
        this.paginationManager.renderPaginationControls(() => {
            this.renderPokemonList(); // Re-render when page changes
        });
    }
    
    populateTypeFilter() {
        if (!this.typeFilterSelect) return;
        
        // Get all types
        const types = this.pokemonDataManager.getAllTypes();
        
        // Add options to select
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            this.typeFilterSelect.appendChild(option);
        });
    }
    
    populateGenerationFilter() {
        const generationFilter = document.getElementById('generation-filter');
        if (!generationFilter) return;
        
        // Get all generations (1-8)
        const generations = [1, 2, 3, 4, 5, 6, 7, 8];
        
        // Add options to select
        generations.forEach(gen => {
            const option = document.createElement('option');
            option.value = gen;
            option.textContent = `Generation ${gen}`;
            generationFilter.appendChild(option);
        });
    }
    
    showError(message) {
        // You could enhance this to show a proper error UI
        alert(message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});