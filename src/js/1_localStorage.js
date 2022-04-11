'use strict';
// Función para guardar los cócteles favoritos en el Local Storage
function getFavLocalStorage() {
  const savedFavorites = localStorage.getItem('favoriteCocktails');
  if (savedFavorites !== null) {
    favoriteCocktails = JSON.parse(savedFavorites);
    renderFavoriteCocktails();
  }
}

// Llamada a la función del Local Storage
getFavLocalStorage();
