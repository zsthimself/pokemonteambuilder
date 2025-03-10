// Pagination Module for Pokemon List

class PaginationManager {
    constructor(itemsPerPage = 20) {
        this.currentPage = 1;
        this.itemsPerPage = itemsPerPage;
        this.totalItems = 0;
        this.totalPages = 0;
        
        // DOM elements
        this.paginationContainer = null;
        this.pageInfoElement = null;
    }
    
    /**
     * Initialize pagination with container element
     * @param {HTMLElement} container - Container for pagination controls
     * @param {HTMLElement} pageInfoElement - Element to display page info
     */
    init(container, pageInfoElement) {
        this.paginationContainer = container;
        this.pageInfoElement = pageInfoElement;
    }
    
    /**
     * Set total number of items and calculate total pages
     * @param {number} totalItems - Total number of items to paginate
     */
    setTotalItems(totalItems) {
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    }
    
    /**
     * Get current page number
     * @returns {number} Current page
     */
    getCurrentPage() {
        return this.currentPage;
    }
    
    /**
     * Get items per page
     * @returns {number} Items per page
     */
    getItemsPerPage() {
        return this.itemsPerPage;
    }
    
    /**
     * Get paginated slice of items
     * @param {Array} items - Full array of items
     * @returns {Array} Paginated slice of items
     */
    getPaginatedItems(items) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return items.slice(startIndex, endIndex);
    }
    
    /**
     * Go to specific page
     * @param {number} page - Page number to go to
     */
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
    
    /**
     * Go to next page
     * @returns {boolean} Whether operation was successful
     */
    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }
    
    /**
     * Go to previous page
     * @returns {boolean} Whether operation was successful
     */
    prevPage() {
        return this.goToPage(this.currentPage - 1);
    }
    
    /**
     * Render pagination controls
     * @param {Function} onPageChange - Callback when page changes
     */
    renderPaginationControls(onPageChange) {
        if (!this.paginationContainer) return;
        
        // Clear container
        this.paginationContainer.innerHTML = '';
        
        // Don't render if there's only one page or no items
        if (this.totalPages <= 1) {
            this.updatePageInfo();
            return;
        }
        
        // Create pagination nav
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Pokemon pagination');
        
        const ul = document.createElement('ul');
        ul.className = 'pagination justify-content-center';
        
        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link';
        prevLink.href = '#';
        prevLink.setAttribute('aria-label', 'Previous');
        prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
        
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.prevPage()) {
                onPageChange();
            }
        });
        
        prevLi.appendChild(prevLink);
        ul.appendChild(prevLi);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page button if not visible
        if (startPage > 1) {
            const firstLi = document.createElement('li');
            firstLi.className = 'page-item';
            
            const firstLink = document.createElement('a');
            firstLink.className = 'page-link';
            firstLink.href = '#';
            firstLink.textContent = '1';
            
            firstLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(1);
                onPageChange();
            });
            
            firstLi.appendChild(firstLink);
            ul.appendChild(firstLi);
            
            // Ellipsis if needed
            if (startPage > 2) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                
                const ellipsisSpan = document.createElement('span');
                ellipsisSpan.className = 'page-link';
                ellipsisSpan.innerHTML = '&hellip;';
                
                ellipsisLi.appendChild(ellipsisSpan);
                ul.appendChild(ellipsisLi);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(i);
                onPageChange();
            });
            
            pageLi.appendChild(pageLink);
            ul.appendChild(pageLi);
        }
        
        // Last page button if not visible
        if (endPage < this.totalPages) {
            // Ellipsis if needed
            if (endPage < this.totalPages - 1) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                
                const ellipsisSpan = document.createElement('span');
                ellipsisSpan.className = 'page-link';
                ellipsisSpan.innerHTML = '&hellip;';
                
                ellipsisLi.appendChild(ellipsisSpan);
                ul.appendChild(ellipsisLi);
            }
            
            const lastLi = document.createElement('li');
            lastLi.className = 'page-item';
            
            const lastLink = document.createElement('a');
            lastLink.className = 'page-link';
            lastLink.href = '#';
            lastLink.textContent = this.totalPages;
            
            lastLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(this.totalPages);
                onPageChange();
            });
            
            lastLi.appendChild(lastLink);
            ul.appendChild(lastLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}`;
        
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.setAttribute('aria-label', 'Next');
        nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
        
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.nextPage()) {
                onPageChange();
            }
        });
        
        nextLi.appendChild(nextLink);
        ul.appendChild(nextLi);
        
        nav.appendChild(ul);
        this.paginationContainer.appendChild(nav);
        
        // Update page info
        this.updatePageInfo();
    }
    
    /**
     * Update page information display
     */
    updatePageInfo() {
        if (!this.pageInfoElement) return;
        
        const startItem = this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(startItem + this.itemsPerPage - 1, this.totalItems);
        
        this.pageInfoElement.textContent = `Showing ${startItem}-${endItem} of ${this.totalItems} Pokemon`;
    }
}

export default PaginationManager;