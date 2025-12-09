export function addToCart(itemData) {
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'myCart';
    
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingItem = cart.find(item => item.id === itemData.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ 
            ...itemData, 
            quantity: 1,
            image: `/images/${itemData.image_url}`
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    showAddToCartNotification(itemData);
}

export function showAddToCartNotification(itemData) {
    let stack = document.querySelector('.cart-notification-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.className = 'cart-notification-stack';
        document.body.appendChild(stack);
    }

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <img src="/images/${itemData.image_url}" alt="${itemData.name}" class="cart-notif-img" />
        <span>${itemData.name} added to cart!</span>
    `;
    stack.appendChild(notification);

    setTimeout(() => {
        notification.remove();
        if (stack.childElementCount === 0) {
            stack.remove();
        }
    }, 2000);
}

