'use strict';
// Pintar/renderizar la lista de cócteles favoritos
function renderFavoriteCocktails() {
  let html = '';

  for (const drinkItem of favoriteCocktails) {
    // let favoriteClass = '';
    // let favoriteClassName = '';
    let imageSrc = generateDefaultImage(drinkItem);

    html += `<li class="favoritesList__item">`;
    html += `<img alt="Cóctel" class="cocktailImg" src="${imageSrc}" />`;
    html += `<h3 class="favoritesList__name">${drinkItem.strDrink}</h3>`;
    html += `<i class="favoritesList__icon js-unfav fa-solid fa-heart-circle-xmark" id="${drinkItem.idDrink}"></i>`;
    html += `</li>`;
  }
  favoritesList.innerHTML = html;
  dislikedListener();
}

// Función manejadora borrar favoritos (uno a uno)
function handleClickDislike(event) {
  const selectedCocktailId = event.currentTarget.id;

  const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });
  if (foundFavoriteIndex !== -1) {
    favoriteCocktails.splice(foundFavoriteIndex, 1);
  }

  localStorage.setItem('favoriteCocktails', JSON.stringify(favoriteCocktails));
  renderCocktailList();
  renderFavoriteCocktails();
}

// Listener borrar favoritos
function dislikedListener() {
  const dislikes = document.querySelectorAll('.js-unfav');
  for (const btnDislike of dislikes) {
    btnDislike.addEventListener('click', handleClickDislike);
  }
}

// Función manejadora borrar favoritos (todos a la vez)
function handleDislikeAllFavs(event) {
  event.preventDefault();
  // inputSearch.value = '';
  favoriteCocktails = [];
  favoritesList.innerHTML = '';
  localStorage.removeItem('favoriteCocktails');
  renderCocktailList();
}
