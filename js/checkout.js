/* ============================================================
   SEN-AGRI-FOOD — Page commande (envoyée sur WhatsApp)
   ============================================================ */

const CHECKOUT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Numéros sénégalais : mobiles 70/75/76/77/78 ou fixes 33, avec +221 / 00221 facultatif
const CHECKOUT_PHONE = /^(?:\+?221|00221)?\s*(?:7[05678]|33)(?:[\s.-]?\d){7}$/;

function updateOrderSummary() {
    const cart = syncCartWithCatalog();
    const itemsContainer = document.getElementById('orderItems');
    const submitBtn = document.getElementById('submitOrder');
    const { subtotal, shipping, total } = calculateTotals(cart);

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<div class="text-center py-3 text-muted"><i class="bi bi-cart-x me-2"></i>Votre panier est vide.
            <div class="mt-2"><a href="boutique.html">Découvrir la boutique</a></div></div>`;
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div><span class="fw-semibold">${escapeHTML(item.name)}</span><span class="text-muted small"> × ${item.quantity}</span></div>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>`).join('');
    }
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    const shippingEl = document.getElementById('checkoutShipping');
    if (cart.length > 0 && shipping === 0) {
        shippingEl.textContent = 'Gratuite';
        shippingEl.style.color = 'var(--success)';
    } else {
        shippingEl.textContent = formatPrice(shipping);
        shippingEl.style.color = '';
    }
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
    if (submitBtn) submitBtn.disabled = cart.length === 0;
}

function validateCheckoutField(field) {
    const value = field.value.trim();
    let valid = true;
    switch (field.id) {
        case 'fullName': valid = value.length >= 3; break;
        case 'phone': valid = CHECKOUT_PHONE.test(value); break;
        case 'email': valid = value === '' || CHECKOUT_EMAIL.test(value); break;
        case 'address': valid = value.length >= 5; break;
        case 'city': valid = value.length >= 2; break;
        default: return true;                      // champs facultatifs
    }
    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid);
    return valid;
}

function initCheckout() {
    updateOrderSummary();

    const form = document.getElementById('checkoutForm');
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required], #email'));
    fields.forEach(field => {
        field.addEventListener('blur', () => validateCheckoutField(field));
        field.addEventListener('input', () => { if (field.classList.contains('is-invalid')) validateCheckoutField(field); });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const allValid = fields.map(validateCheckoutField).every(Boolean);
        if (!allValid) {
            showNotification('Veuillez remplir tous les champs correctement', 'error');
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        if (syncCartWithCatalog().length === 0) {
            showNotification('Votre panier est vide', 'error');
            updateOrderSummary();
            return;
        }
        submitOrder(form, fields);
    });
}

function buildOrderMessage(order) {
    const c = order.customer;
    const lines = [
        'Bonjour, je souhaite passer commande sur Sen-Agri-Food.',
        `Commande n° ${order.orderNumber}`,
        '',
        'Produits :',
        ...order.items.map(i => `• ${i.name} (${i.unit}) × ${i.quantity} = ${formatPrice(i.price * i.quantity)}`),
        '',
        `Sous-total : ${formatPrice(order.subtotal)}`,
        `Livraison : ${order.shipping === 0 ? 'Gratuite' : formatPrice(order.shipping)}`,
        `TOTAL : ${formatPrice(order.total)}`,
        '',
        `Nom : ${c.fullName}`,
        `Téléphone : ${c.phone}`,
        ...(c.email ? [`E-mail : ${c.email}`] : []),
        `Adresse : ${c.address}, ${c.city}`,
        ...(c.instructions ? [`Instructions : ${c.instructions}`] : []),
        '',
        'Merci de me confirmer la commande, les frais de livraison et le paiement.'
    ];
    return lines.join('\n');
}

function submitOrder(form, fields) {
    const cart = syncCartWithCatalog();
    const order = {
        orderNumber: 'SA-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).slice(-4).toUpperCase(),
        date: new Date().toLocaleString('fr-FR'),
        customer: {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            instructions: document.getElementById('deliveryInstructions').value.trim()
        },
        items: cart,
        ...calculateTotals(cart)
    };
    const message = buildOrderMessage(order);

    // Ouverture de WhatsApp immédiatement, pendant le clic (sinon le navigateur la bloque)
    openWhatsApp(message);

    const orders = readStorage(STORAGE_KEYS.orders);
    orders.push(order);
    writeStorage(STORAGE_KEYS.orders, orders);
    localStorage.removeItem(STORAGE_KEYS.cart);
    form.reset();
    fields.forEach(f => f.classList.remove('is-valid', 'is-invalid'));
    updateCartCount();
    updateOrderSummary();                        // vide le résumé et désactive le bouton
    showConfirmation(order, message);
}

function showConfirmation(order, message) {
    document.getElementById('confirmationName').textContent = order.customer.fullName;
    document.getElementById('confirmationNumber').textContent = `N° de commande : ${order.orderNumber}`;
    document.getElementById('whatsappLink').href = whatsappUrl(message);
    const modalEl = document.getElementById('confirmationModal');
    if (window.bootstrap) bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

onPage('commande', initCheckout);
