// Cart System for Nexus Tech Hub
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.attachEventListeners();
    }

    loadCart() {
        const cart = localStorage.getItem('nexustech_cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('nexustech_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.cart.find(item =>
            item.id === product.id &&
            item.storage === product.storage &&
            item.condition === product.condition
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                ...product,
                quantity: product.quantity || 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(itemId, storage, condition) {
        this.cart = this.cart.filter(item =>
            !(item.id === itemId && item.storage === storage && item.condition === condition)
        );
        this.saveCart();
        this.showNotification('Item removed from cart', 'info');
    }

    updateQuantity(itemId, storage, condition, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(itemId, storage, condition);
            return;
        }

        const item = this.cart.find(item =>
            item.id === itemId && item.storage === storage && item.condition === condition
        );

        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
        }
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.showNotification('Cart cleared', 'info');
    }

    updateCartDisplay() {
        // Update cart count in header
        const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-badge');
        const totalItems = this.getTotalItems();

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });

        // Update cart total in header if exists
        const cartTotalElements = document.querySelectorAll('.cart-total');
        const totalPrice = this.getTotalPrice();

        cartTotalElements.forEach(element => {
            element.textContent = totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : '$0.00';
        });
    }

    attachEventListeners() {
        // Attach add to cart listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
                this.handleAddToCart(button);
            }
        });

        // Cart dropdown toggle (if implemented)
        const cartToggle = document.querySelector('.cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCartDropdown();
            });
        }
    }

    handleAddToCart(button) {
        const productCard = button.closest('.card, .product-card');
        if (!productCard) return;

        const product = {
            id: productCard.dataset.productId || button.dataset.productId || `product_${Date.now()}`,
            name: productCard.querySelector('.card-title, .product-title')?.textContent?.trim() || 'Unknown Product',
            price: parseFloat(button.dataset.price || productCard.dataset.price || 0),
            image: productCard.querySelector('img')?.src || '',
            storage: button.dataset.storage || productCard.dataset.storage || '',
            condition: button.dataset.condition || productCard.dataset.condition || 'New',
            category: button.dataset.category || productCard.dataset.category || 'General'
        };

        if (product.price > 0) {
            this.addItem(product);
        } else {
            this.showNotification('Price not available for this item', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#0066cc'
        };
        return colors[type] || colors.info;
    }

    toggleCartDropdown() {
        // Implement cart dropdown if needed
        console.log('Cart dropdown toggle clicked');
    }

    getCartItems() {
        return [...this.cart];
    }

    isEmpty() {
        return this.cart.length === 0;
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
