// Loading Indicator Module

const LoadingIndicator = {
    loadingContainer: null,
    
    /**
     * Initialize the loading indicator
     */
    init() {
        // Create loading container if it doesn't exist
        if (!this.loadingContainer) {
            this.loadingContainer = document.createElement('div');
            this.loadingContainer.className = 'loading-container';
            this.loadingContainer.style.display = 'none';
            
            // Create pokeball loader
            const pokeballLoader = document.createElement('div');
            pokeballLoader.className = 'pokeball-loader';
            
            // Add loading text
            const loadingText = document.createElement('p');
            loadingText.textContent = 'Loading...';
            loadingText.style.marginTop = '15px';
            loadingText.style.fontWeight = 'bold';
            loadingText.style.color = '#333';
            
            // Append elements
            this.loadingContainer.appendChild(pokeballLoader);
            this.loadingContainer.appendChild(loadingText);
            document.body.appendChild(this.loadingContainer);
        }
    },
    
    /**
     * Show the loading indicator
     * @param {string} message - Optional custom loading message
     */
    show(message = 'Loading...') {
        this.init();
        
        // Update message if provided
        if (message && this.loadingContainer.querySelector('p')) {
            this.loadingContainer.querySelector('p').textContent = message;
        }
        
        // Show the loading container
        this.loadingContainer.style.display = 'flex';
    },
    
    /**
     * Hide the loading indicator
     */
    hide() {
        if (this.loadingContainer) {
            this.loadingContainer.style.display = 'none';
        }
    }
};

export default LoadingIndicator;