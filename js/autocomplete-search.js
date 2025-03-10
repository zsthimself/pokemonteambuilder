// Autocomplete Search Functionality for Pokemon Team Builder

class AutocompleteSearch {
    constructor(pokemonDataManager) {
        this.pokemonDataManager = pokemonDataManager;
        this.searchInput = document.getElementById('pokemon-search');
        this.suggestionsContainer = null;
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        // Create suggestions container
        this.createSuggestionsContainer();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    createSuggestionsContainer() {
        // Create suggestions container if it doesn't exist
        if (!document.getElementById('search-suggestions')) {
            this.suggestionsContainer = document.createElement('div');
            this.suggestionsContainer.id = 'search-suggestions';
            this.suggestionsContainer.className = 'search-suggestions';
            this.searchInput.parentNode.appendChild(this.suggestionsContainer);
            
            // Add styles if not already in CSS
            if (!document.getElementById('autocomplete-styles')) {
                const style = document.createElement('style');
                style.id = 'autocomplete-styles';
                style.textContent = `
                    .search-suggestions {
                        position: absolute;
                        width: 100%;
                        max-height: 300px;
                        overflow-y: auto;
                        background: white;
                        border: 1px solid #ddd;
                        border-top: none;
                        border-radius: 0 0 4px 4px;
                        z-index: 1000;
                        display: none;
                    }
                    .search-suggestion {
                        padding: 8px 12px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                    }
                    .search-suggestion:hover {
                        background-color: #f5f5f5;
                    }
                    .search-suggestion img {
                        width: 30px;
                        height: 30px;
                        margin-right: 10px;
                    }
                    .search-suggestion-info {
                        display: flex;
                        flex-direction: column;
                    }
                    .search-suggestion-name {
                        font-weight: bold;
                    }
                    .search-suggestion-types {
                        display: flex;
                        gap: 5px;
                        margin-top: 2px;
                    }
                    .search-suggestion-type {
                        font-size: 0.7rem;
                        padding: 1px 6px;
                        border-radius: 10px;
                        color: white;
                        text-shadow: 0 1px 1px rgba(0,0,0,0.3);
                    }
                    .search-input-wrapper {
                        position: relative;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Make the search input container relative for positioning
            this.searchInput.parentNode.classList.add('search-input-wrapper');
        } else {
            this.suggestionsContainer = document.getElementById('search-suggestions');
        }
    }
    
    setupEventListeners() {
        // Input event for search box
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        
        // Focus event to show suggestions if input has value
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length > 0) {
                this.showSuggestions(this.searchInput.value);
            }
        });
        
        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
        
        // Keyboard navigation
        this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            this.showSuggestions(query);
        } else {
            this.hideSuggestions();
        }
    }
    
    handleKeydown(e) {
        // If suggestions are not visible, do nothing
        if (this.suggestionsContainer.style.display !== 'block') return;
        
        const suggestions = this.suggestionsContainer.querySelectorAll('.search-suggestion');
        let activeIndex = Array.from(suggestions).findIndex(el => el.classList.contains('active'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestion(activeIndex, 1, suggestions);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestion(activeIndex, -1, suggestions);
                break;
                
            case 'Enter':
                if (activeIndex >= 0) {
                    e.preventDefault();
                    suggestions[activeIndex].click();
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    navigateSuggestion(currentIndex, direction, suggestions) {
        // Remove active class from current suggestion
        if (currentIndex >= 0) {
            suggestions[currentIndex].classList.remove('active');
        }
        
        // Calculate new index
        let newIndex;
        if (direction === 1) {
            // Down arrow
            newIndex = (currentIndex + 1) % suggestions.length;
        } else {
            // Up arrow
            newIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1;
        }
        
        // Add active class to new suggestion
        suggestions[newIndex].classList.add('active');
        suggestions[newIndex].scrollIntoView({ block: 'nearest' });
    }
    
    showSuggestions(query) {
        // Get matching Pokemon
        const matches = this.getMatchingPokemon(query);
        
        // Clear previous suggestions
        this.suggestionsContainer.innerHTML = '';
        
        if (matches.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        // Create suggestion elements
        matches.forEach(pokemon => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'search-suggestion';
            suggestionElement.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.nameEn}">
                <div class="search-suggestion-info">
                    <div class="search-suggestion-name">${pokemon.nameEn}</div>
                    <div class="search-suggestion-types">
                        ${pokemon.types.map(type => `<span class="search-suggestion-type type-${type}">${type}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Add click event
            suggestionElement.addEventListener('click', () => {
                this.selectPokemon(pokemon);
            });
            
            this.suggestionsContainer.appendChild(suggestionElement);
        });
        
        // Show suggestions container
        this.suggestionsContainer.style.display = 'block';
    }
    
    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
    }
    
    getMatchingPokemon(query) {
        query = query.toLowerCase();
        
        // Filter Pokemon by name
        return this.pokemonDataManager.pokemonList.filter(pokemon => {
            const matchesName = pokemon.name.toLowerCase().includes(query);
            const matchesNameEn = pokemon.nameEn.toLowerCase().includes(query);
            return matchesName || matchesNameEn;
        }).slice(0, 10); // Limit to 10 results for performance
    }
    
    selectPokemon(pokemon) {
        // Set input value to selected Pokemon name
        this.searchInput.value = pokemon.nameEn;
        
        // Hide suggestions
        this.hideSuggestions();
        
        // Trigger search event to update the Pokemon list
        this.searchInput.dispatchEvent(new Event('input'));
        
        // Optional: Scroll to the Pokemon in the list
        setTimeout(() => {
            const pokemonCard = document.querySelector(`#pokemon-list .pokemon-card:has(.pokemon-name:contains('${pokemon.nameEn}'))`);
            if (pokemonCard) {
                pokemonCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
}

export default AutocompleteSearch;