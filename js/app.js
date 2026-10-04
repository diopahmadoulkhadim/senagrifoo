/* ============================================================
   SEN-AGRI-FOOD — Fonctions communes à toutes les pages
   ============================================================ */

/* Numéro WhatsApp de la gérante (Sokhna Mariama Bousso Diop), format international sans + */
const WHATSAPP_NUMBER = '221775324672';

const SHIPPING_COST = 1000;
const FREE_SHIPPING_THRESHOLD = 10000;
const STORAGE_KEYS = {
    cart: 'senAgriCart',
    favorites: 'senAgriFavorites',
    orders: 'senAgriOrders',
    messages: 'senAgriMessages'
};

/* ---------- Stockage (localStorage protégé) ---------- */
function readStorage(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (e) {
        return [];
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        showNotification("Impossible d'enregistrer les données (stockage du navigateur indisponible).", 'error');
        return false;
    }
}

function getCart() { return readStorage(STORAGE_KEYS.cart); }
function saveCart(cart) { return writeStorage(STORAGE_KEYS.cart, cart); }

/* Les favoris sont stockés sous forme d'identifiants (anciens objets {id,...} acceptés) */
function getFavoriteIds() {
    return readStorage(STORAGE_KEYS.favorites)
        .map(f => (typeof f === 'object' && f !== null ? f.id : f))
        .filter(id => Number.isInteger(id));
}
function saveFavoriteIds(ids) { return writeStorage(STORAGE_KEYS.favorites, ids); }

/* ---------- Compteurs de la barre de navigation ---------- */
function setBadge(el, count) {
    if (!el) return;
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
}

function updateCartCount() {
    setBadge(document.getElementById('cartCount'), getCart().reduce((sum, item) => sum + item.quantity, 0));
}

function updateFavoritesCount() {
    setBadge(document.getElementById('favoritesCount'), getFavoriteIds().length);
}

function updateAllCounters() {
    updateCartCount();
    updateFavoritesCount();
}

/* ---------- Notifications ---------- */
function showNotification(message, type = 'success', duration = 3000) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const icons = {
        success: 'bi-check-circle-fill text-success',
        error: 'bi-x-circle-fill text-danger',
        warning: 'bi-exclamation-triangle-fill text-warning',
        info: 'bi-info-circle-fill text-primary'
    };
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const row = document.createElement('div');
    row.className = 'd-flex align-items-center';
    const icon = document.createElement('i');
    icon.className = `bi ${icons[type] || icons.info} me-2`;
    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'btn-close ms-3';
    close.setAttribute('aria-label', 'Fermer');
    close.addEventListener('click', () => notification.remove());
    row.append(icon, text, close);
    notification.appendChild(row);
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/* ---------- Utilitaires ---------- */
function formatPrice(price) {
    return Number(price).toLocaleString('fr-FR') + ' FCFA';
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = cart.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    return { subtotal, shipping, total: subtotal + shipping };
}

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* Comparaison sans accents ni majuscules (« epices » trouve « Épices ») */
function normalizeText(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/* ---------- WhatsApp ---------- */
function whatsappUrl(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* À appeler directement dans un clic/envoi de formulaire (sinon le navigateur bloque la fenêtre) */
function openWhatsApp(text) {
    const win = window.open(whatsappUrl(text), '_blank');
    if (win) win.opener = null;
    return !!win;
}

/* ---------- Initialisation par page ---------- */
const pageInits = {};
function onPage(name, fn) { pageInits[name] = fn; }

function markActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll('#mainNav .nav-link').forEach(link => {
        const active = link.dataset.page === page;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    markActiveNav();
    updateAllCounters();
    document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
    const init = pageInits[document.body.dataset.page];
    if (typeof init === 'function') init();
});

/* Synchronise les compteurs si le panier/les favoris changent dans un autre onglet */
window.addEventListener('storage', updateAllCounters);
