// Universal Add to Cart + Notification for all components
export function addToCart(itemData) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === itemData.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...itemData, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showAddToCartNotification(itemData);
    // Optionally: emit event or call updateCartDisplay()
}

export function showAddToCartNotification(itemData) {
    // Find or create the notification stack container
    let stack = document.querySelector('.cart-notification-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.className = 'cart-notification-stack';
        document.body.appendChild(stack);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <img src="/images/${itemData.image_url}" alt="${itemData.name}" class="cart-notif-img" />
        <span>${itemData.name} added to cart!</span>
    `;
    stack.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
        notification.remove();
        // Remove stack if empty
        if (stack.childElementCount === 0) {
            stack.remove();
        }
    }, 2000);
}

// Add this CSS globally (e.g., in App.vue or main.css)
// .cart-notification {
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     background: #fff;
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0,0,0,0.15);
//     display: flex;
//     align-items: center;
//     padding: 12px 20px;
//     z-index: 9999;
//     font-size: 1rem;
// }
// .cart-notif-img {
//     width: 40px;
//     height: 60px;
//     object-fit: cover;
//     margin-right: 12px;
// }
