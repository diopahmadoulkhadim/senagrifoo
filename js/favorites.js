/* ============================================================
   SEN-AGRI-FOOD — Page favoris
   (toggleFavorite et les cartes viennent de products.js)
   ============================================================ */

function loadFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const emptyContainer = document.getElementById('emptyFavorites');
    const loader = document.getElementById('favoritesLoader');
    const countLabel = document.getElementById('favoritesCountLabel');
    if (loader) loader.style.display = 'none';

    // Ne garde que les favoris qui existent encore dans le catalogue
    const ids = getFavoriteIds().filter(id => getProductById(id));
    if (ids.length !== getFavoriteIds().length) saveFavoriteIds(ids);
    updateFavoritesCount();

    countLabel.textContent = `${ids.length} produit${ids.length > 1 ? 's' : ''}`;
    if (ids.length === 0) {
        grid.style.display = 'none';
        emptyContainer.style.display = 'block';
        return;
    }
    emptyContainer.style.display = 'none';
    grid.style.display = '';
    renderProductGrid(grid, ids.map(getProductById), { favorite: true });
}

onPage('favoris', loadFavorites);
