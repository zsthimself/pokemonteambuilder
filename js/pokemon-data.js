// Pokemon Data Management

class PokemonDataManager {
    constructor() {
        this.pokemonList = [];
        this.typeChart = {};
    }

    async loadPokemonData() {
        try {
            // 尝试加载更新的宝可梦数据文件
            try {
                const response = await fetch('data/updated-pokemon.json');
                this.pokemonList = await response.json();
                console.log('Loaded updated Pokemon data');
                return this.pokemonList;
            } catch (updatedError) {
                // 如果更新的数据文件不存在，则加载原始数据文件
                console.warn('Could not load updated Pokemon data, falling back to original data');
                const response = await fetch('data/pokemon.json');
                this.pokemonList = await response.json();
                return this.pokemonList;
            }
        } catch (error) {
            console.error('Error loading Pokemon data:', error);
            return [];
        }
    }

    async loadTypeChart() {
        try {
            const response = await fetch('data/type-chart.json');
            this.typeChart = await response.json();
            return this.typeChart;
        } catch (error) {
            console.error('Error loading type chart:', error);
            return {};
        }
    }

    getPokemonById(id) {
        return this.pokemonList.find(pokemon => pokemon.id === id);
    }

    getPokemonByName(name) {
        return this.pokemonList.find(pokemon => 
            pokemon.name.toLowerCase() === name.toLowerCase() ||
            pokemon.nameEn.toLowerCase() === name.toLowerCase()
        );
    }

    filterPokemon(filters) {
        return this.pokemonList.filter(pokemon => {
            // Filter by name/nameEn
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
                const matchesNameEn = pokemon.nameEn.toLowerCase().includes(searchTerm);
                if (!matchesName && !matchesNameEn) return false;
            }

            // Filter by type
            if (filters.type && !pokemon.types.includes(filters.type)) {
                return false;
            }

            // Filter by generation
            if (filters.generation && pokemon.generation !== parseInt(filters.generation)) {
                return false;
            }

            // Filter by stats
            if (filters.statType && filters.statValue) {
                const statValue = parseInt(filters.statValue);
                if (!isNaN(statValue) && pokemon.stats[filters.statType] < statValue) {
                    return false;
                }
            }

            return true;
        });
    }

    getAllTypes() {
        const types = new Set();
        this.pokemonList.forEach(pokemon => {
            pokemon.types.forEach(type => types.add(type));
        });
        return Array.from(types).sort();
    }
}

// Create and export a single instance
const pokemonDataManager = new PokemonDataManager();
export default pokemonDataManager;