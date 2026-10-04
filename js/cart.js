/* ============================================================
   SEN-AGRI-FOOD — Page panier
   ============================================================ */

function loadCart() {
    const cart = syncCartWithCatalog();
    const itemsContainer = document.getElementById('cartItems');
    const emptyContainer = document.getElementById('emptyCart');
    const loader = document.getElementById('cartLoader');
    const countEl = document.getElementById('cartItemCount');
    if (loader) loader.style.display = 'none';

    const units = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.textContent = `${units} article${units > 1 ? 's' : ''}`;

    if (cart.length === 0) {
        itemsContainer.style.display = 'none';
        emptyContainer.style.display = 'block';
        updateCartTotals(cart);
        return;
    }
    itemsContainer.style.display = 'block';
    emptyContainer.style.display = 'none';

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="row align-items-center g-3">
                <div class="col-3 col-md-2"><img src="images/${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" class="item-image w-100"></div>
                <div class="col-9 col-md-4">
                    <h2 class="item-name h6 mb-1"><a href="produits.html?id=${item.id}" class="text-decoration-none text-reset">${escapeHTML(item.name)}</a></h2>
                    <span class="text-muted small">${escapeHTML(item.unit)} · ${formatPrice(item.price)}</span>
                </div>
                <div class="col-7 col-md-3">
                    <div class="d-flex align-items-center">
                        <button type="button" class="quantity-btn" data-cart-action="dec" data-id="${item.id}" aria-label="Diminuer la quantité de ${escapeHTML(item.name)}"><i class="bi bi-dash"></i></button>
                        <span class="quantity-display" aria-live="polite">${item.quantity}</span>
                        <button type="button" class="quantity-btn" data-cart-action="inc" data-id="${item.id}" aria-label="Augmenter la quantité de ${escapeHTML(item.name)}"><i class="bi bi-plus"></i></button>
                    </div>
                </div>
                <div class="col-3 col-md-2 text-end"><span class="item-price">${formatPrice(item.price * item.quantity)}</span></div>
                <div class="col-2 col-md-1 text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-circle" data-cart-action="remove" data-id="${item.id}" aria-label="Retirer ${escapeHTML(item.name)} du panier"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>`).join('') + `<div class="text-end"><button type="button" class="btn btn-link text-danger btn-sm" id="clearCartBtn"><i class="bi bi-trash me-1"></i>Vider le panier</button></div>`;
    updateCartTotals(cart);
}

function updateCartTotals(cart) {
    const { subtotal, shipping, total } = calculateTotals(cart);
    const shippingEl = document.getElementById('shipping');
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(total);
    if (shipping === 0 && cart.length > 0) {
        shippingEl.textContent = 'Gratuite';
        shippingEl.style.color = 'var(--success)';
    } else {
        shippingEl.textContent = formatPrice(shipping);
        shippingEl.style.color = '';
    }
    const hint = document.getElementById('shippingHint');
    if (hint) {
        const missing = FREE_SHIPPING_THRESHOLD - subtotal;
        hint.textContent = cart.length > 0 && missing > 0
            ? `Plus que ${formatPrice(missing)} pour la livraison gratuite.` : '';
    }
    const btn = document.getElementById('checkoutBtn');
    const empty = cart.length === 0;
    btn.classList.toggle('disabled', empty);
    btn.setAttribute('aria-disabled', empty);
    btn.tabIndex = empty ? -1 : 0;
}

function changeQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) { removeFromCart(id); return; }
    if (newQty > item.maxStock) { showNotification('Stock maximum atteint', 'warning'); return; }
    item.quantity = newQty;
    saveCart(cart);
    loadCart();
    updateCartCount();
}

function removeFromCart(id) {
    const cart = getCart();
    const index = cart.findIndex(i => i.id === id);
    if (index === -1) return;
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCartCount();
    showNotification(`${name} retiré du panier`, 'info');
}

function clearCart() {
    if (!confirm('Vider votre panier ?')) return;
    localStorage.removeItem(STORAGE_KEYS.cart);
    loadCart();
    updateCartCount();
    showNotification('Panier vidé', 'info');
}

document.addEventListener('click', event => {
    const btn = event.target.closest('[data-cart-action]');
    if (btn) {
        const id = Number(btn.dataset.id);
        const action = btn.dataset.cartAction;
        if (action === 'inc') changeQuantity(id, 1);
        else if (action === 'dec') changeQuantity(id, -1);
        else if (action === 'remove') removeFromCart(id);
        return;
    }
    if (event.target.closest('#clearCartBtn')) clearCart();
    const checkout = event.target.closest('#checkoutBtn');
    if (checkout && checkout.classList.contains('disabled')) {
        event.preventDefault();
        showNotification('Votre panier est vide', 'warning');
    }
});

onPage('panier', loadCart);
