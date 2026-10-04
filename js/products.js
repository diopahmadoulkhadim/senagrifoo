/* ============================================================
   SEN-AGRI-FOOD — Produits : affichage, filtres, panier, favoris
   (les données viennent de data/products.js)
   ============================================================ */

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'relevance';

function getProductById(id) {
    return PRODUCTS.find(p => p.id === Number(id));
}

function getCategoryLabel(category) {
    return CATEGORIES[category] || category;
}

function productImage(product) {
    return 'images/' + product.image;
}

/* ---------- Cartes produit ---------- */
function createProductCard(product) {
    const isFav = getFavoriteIds().includes(product.id);
    const inStock = product.stock > 0;
    const url = `produits.html?id=${product.id}`;
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <a href="${url}" tabindex="-1" aria-hidden="true">
                    <img src="${productImage(product)}" alt="${escapeHTML(product.name)}" class="product-image" loading="lazy">
                </a>
                ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ''}
                <button type="button" class="favorite-btn ${isFav ? 'active' : ''}" data-fav="${product.id}"
                        aria-pressed="${isFav}" aria-label="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'} : ${escapeHTML(product.name)}">
                    <i class="bi bi-heart${isFav ? '-fill' : ''}"></i>
                </button>
            </div>
            <div class="product-body">
                <div class="d-flex justify-content-between align-items-start">
                    <span class="product-category">${escapeHTML(getCategoryLabel(product.category))}</span>
                    <span class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">${inStock ? '✓ En stock' : 'Rupture de stock'}</span>
                </div>
                <h3 class="product-name h5"><a href="${url}" class="text-decoration-none text-reset">${escapeHTML(product.name)}</a></h3>
                <p class="product-description">${escapeHTML(product.description)}</p>
                <div class="d-flex justify-content-between align-items-center gap-2">
                    <div><span class="product-price">${formatPrice(product.price)}</span><span class="product-unit ms-1">/ ${escapeHTML(product.unit)}</span></div>
                </div>
                <button type="button" class="btn-add-cart mt-3" data-add="${product.id}" ${inStock ? '' : 'disabled'}>
                    <i class="bi bi-cart-plus me-1"></i>${inStock ? 'Ajouter au panier' : 'Indisponible'}
                </button>
            </div>
        </div>`;
}

function renderProductGrid(grid, products) {
    grid.innerHTML = products.map(p => `<div class="col-6 col-md-4 col-lg-3">${createProductCard(p)}</div>`).join('');
}

/* ---------- Boutique : recherche, filtre, tri ---------- */
function sortProducts(products, sortType) {
    const sorted = [...products];
    switch (sortType) {
        case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
        case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
        case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr')); break;
        case 'newest': sorted.sort((a, b) => b.id - a.id); break;
        default: sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
}

function applyFilters() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    let list = PRODUCTS.filter(p => currentCategory === 'all' || p.category === currentCategory);
    if (currentSearch) {
        const q = normalizeText(currentSearch);
        list = list.filter(p => normalizeText(`${p.name} ${p.description} ${getCategoryLabel(p.category)}`).includes(q));
    }
    list = sortProducts(list, currentSort);

    const count = document.getElementById('productCount');
    if (count) count.textContent = `${list.length} produit${list.length > 1 ? 's' : ''}`;
    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = list.length === 0 ? 'block' : 'none';
    renderProductGrid(grid, list);
}

function setActiveFilterButton(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const active = btn.dataset.category === category;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
    });
}

function initShop() {
    const params = new URLSearchParams(location.search);
    const wanted = params.get('categorie');
    if (wanted && CATEGORIES[wanted]) currentCategory = wanted;
    setActiveFilterButton(currentCategory);

    const search = document.getElementById('searchInput');
    if (search) search.addEventListener('input', () => { currentSearch = search.value; applyFilters(); });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            setActiveFilterButton(currentCategory);
            applyFilters();
        });
    });

    const sort = document.getElementById('sortSelect');
    if (sort) sort.addEventListener('change', () => { currentSort = sort.value; applyFilters(); });

    const reset = document.getElementById('resetFilters');
    if (reset) reset.addEventListener('click', () => {
        currentCategory = 'all'; currentSearch = ''; currentSort = 'relevance';
        if (search) search.value = '';
        if (sort) sort.value = 'relevance';
        setActiveFilterButton('all');
        applyFilters();
    });

    const loader = document.getElementById('productsLoader');
    if (loader) loader.style.display = 'none';
    applyFilters();
}

/* ---------- Accueil ---------- */
function initHome() {
    const featured = document.getElementById('featuredProducts');
    if (featured) {
        const list = PRODUCTS.filter(p => p.isPopular).slice(0, 4);
        renderProductGrid(featured, list.length ? list : PRODUCTS.slice(0, 4));
    }
    document.querySelectorAll('[data-category-count]').forEach(el => {
        const n = PRODUCTS.filter(p => p.category === el.dataset.categoryCount).length;
        el.textContent = `${n} produit${n > 1 ? 's' : ''}`;
    });
    document.querySelectorAll('[data-product-total]').forEach(el => { el.textContent = PRODUCTS.length; });
}

/* ---------- Catalogue / fiche produit (produits.html) ---------- */
function initCatalog() {
    const id = new URLSearchParams(location.search).get('id');
    const product = id ? getProductById(id) : null;
    const catalog = document.getElementById('catalogView');
    const detail = document.getElementById('detailView');

    if (id && !product) showNotification('Produit introuvable : voici tout le catalogue.', 'warning', 4000);

    if (product) {
        catalog.style.display = 'none';
        detail.style.display = 'block';
        document.title = `${product.name} — Sen-Agri-Food`;
        renderProductDetail(product);
    } else {
        detail.style.display = 'none';
        catalog.style.display = 'block';
        renderProductGrid(document.getElementById('catalogGrid'), PRODUCTS);
    }
}

function renderProductDetail(product) {
    const isFav = getFavoriteIds().includes(product.id);
    const inStock = product.stock > 0;
    const others = PRODUCTS.filter(p => p.id !== product.id)
        .sort((a, b) => (b.category === product.category) - (a.category === product.category)).slice(0, 4);

    document.getElementById('detailView').innerHTML = `
        <nav aria-label="Fil d'Ariane" class="mb-4 small">
            <a href="boutique.html" class="text-decoration-none"><i class="bi bi-arrow-left me-1"></i>Retour à la boutique</a>
        </nav>
        <div class="row gy-4 gx-md-5 align-items-start">
            <div class="col-md-6">
                <div class="detail-image-box">
                    <img src="${productImage(product)}" alt="${escapeHTML(product.name)}">
                    ${product.badge ? `<span class="product-badge-detail">${escapeHTML(product.badge)}</span>` : ''}
                </div>
            </div>
            <div class="col-md-6" data-product-id="${product.id}">
                <span class="product-category-detail">${escapeHTML(getCategoryLabel(product.category))}</span>
                <h1 class="detail-title">${escapeHTML(product.name)}</h1>
                <p class="detail-price">${formatPrice(product.price)} <span class="product-unit">/ ${escapeHTML(product.unit)}</span></p>
                <p class="mb-4">${escapeHTML(product.description)}</p>
                ${product.usage ? `<h2 class="h6 fw-bold"><i class="bi bi-cup-hot me-2 text-accent"></i>Mode d'emploi</h2><p class="text-muted">${escapeHTML(product.usage)}</p>` : ''}
                <ul class="list-unstyled detail-facts">
                    <li><i class="bi bi-box me-2"></i>Conditionnement : ${escapeHTML(product.unit)}</li>
                    <li><i class="bi bi-calendar me-2"></i>DLC : ${escapeHTML(product.dlc)}</li>
                    <li><i class="bi bi-geo-alt me-2"></i>Origine : Sénégal</li>
                </ul>
                <div class="d-flex flex-wrap gap-2 mt-4">
                    <button type="button" class="btn btn-primary btn-lg rounded-pill px-4" data-add="${product.id}" ${inStock ? '' : 'disabled'}>
                        <i class="bi bi-cart-plus me-2"></i>${inStock ? 'Ajouter au panier' : 'Indisponible'}
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-lg rounded-pill favorite-btn-detail ${isFav ? 'active' : ''}" data-fav="${product.id}" aria-pressed="${isFav}">
                        <i class="bi bi-heart${isFav ? '-fill' : ''} me-2"></i><span>${isFav ? 'Dans mes favoris' : 'Ajouter aux favoris'}</span>
                    </button>
                </div>
            </div>
        </div>
        <section class="mt-5 pt-4">
            <h2 class="h4 fw-bold mb-4">Vous aimerez aussi</h2>
            <div class="row g-4" id="relatedGrid"></div>
        </section>`;
    renderProductGrid(document.getElementById('relatedGrid'), others);
}

/* ---------- Panier (ajout) ---------- */
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) { showNotification('Produit non trouvé', 'error'); return; }
    if (product.stock <= 0) { showNotification('Rupture de stock', 'error'); return; }

    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) { showNotification('Stock maximum atteint', 'warning'); return; }
        existing.quantity++;
        existing.maxStock = product.stock;
        showNotification(`Quantité augmentée : ${product.name}`, 'success');
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image,
                    unit: product.unit, quantity: 1, maxStock: product.stock });
        showNotification(`Ajouté au panier : ${product.name}`, 'success');
    }
    if (saveCart(cart)) updateCartCount();
}

/* Remet le panier d'accord avec le catalogue (prix, stock, produits supprimés) */
function syncCartWithCatalog() {
    const cart = getCart();
    const synced = [];
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product || product.stock <= 0) return;
        synced.push({ id: product.id, name: product.name, price: product.price, image: product.image,
                      unit: product.unit, quantity: Math.min(Math.max(1, item.quantity | 0), product.stock),
                      maxStock: product.stock });
    });
    if (JSON.stringify(synced) !== JSON.stringify(cart)) saveCart(synced);
    return synced;
}

/* ---------- Favoris (bascule) ---------- */
function toggleFavorite(productId) {
    const product = getProductById(productId);
    if (!product) return;
    let ids = getFavoriteIds();
    const wasFav = ids.includes(product.id);
    ids = wasFav ? ids.filter(id => id !== product.id) : [...ids, product.id];
    if (!saveFavoriteIds(ids)) return;
    showNotification(wasFav ? 'Produit retiré des favoris' : 'Produit ajouté aux favoris', wasFav ? 'info' : 'success');
    updateFavoritesCount();
    refreshFavoriteButtons(product.id, !wasFav);
    if (typeof loadFavorites === 'function' && document.getElementById('favoritesGrid')) loadFavorites();
}

function refreshFavoriteButtons(productId, isFav) {
    document.querySelectorAll(`[data-fav="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', isFav);
        btn.setAttribute('aria-pressed', isFav);
        const icon = btn.querySelector('i');
        if (icon) icon.className = `bi bi-heart${isFav ? '-fill' : ''}${btn.classList.contains('favorite-btn-detail') ? ' me-2' : ''}`;
        const label = btn.querySelector('span');
        if (label) label.textContent = isFav ? 'Dans mes favoris' : 'Ajouter aux favoris';
        if (btn.classList.contains('favorite-btn')) {
            const name = (getProductById(productId) || {}).name || '';
            btn.setAttribute('aria-label', `${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'} : ${name}`);
        }
    });
}

/* Un seul écouteur pour tous les boutons « ajouter » et « favori » de la page */
document.addEventListener('click', event => {
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) { addToCart(Number(addBtn.dataset.add)); return; }
    const favBtn = event.target.closest('[data-fav]');
    if (favBtn) toggleFavorite(Number(favBtn.dataset.fav));
});

onPage('index', initHome);
onPage('boutique', initShop);
onPage('produits', initCatalog);
