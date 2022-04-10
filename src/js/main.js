'use strict';
// Constantes
const cocktailList = document.querySelector('.js-cocktailList');
const favoritesList = document.querySelector('.js-favoritesList');

const inputSearch = document.querySelector('.js-search');
const defaultImage =
  'https://via.placeholder.com/150x150/ffffff/666666/?text=drink';

const btnSubmit = document.querySelector('.js-submitBtn');
const btnReset = document.querySelector('.js-resetBtn');

// Variables (arrays)
let drinks = [];
let favoriteCocktails = [];

// Funciones
function handleInputSearch(event) {
  event.preventDefault();

  const filterValue = inputSearch.value;

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filterValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      drinks = data.drinks;
      if (inputSearch.value === '') {
        // alert('El campo de búsqueda no puede estar vacío');
        cocktailList.innerHTML = '...¡Nada por aquí!';
      } else {
        renderCocktailList();
      }
    });
}

function generateDefaultImage(drinkItem) {
  let cocktailImage = '';
  if (drinkItem.strDrinkThumb !== null) {
    cocktailImage = drinkItem.strDrinkThumb;
  } else {
    cocktailImage = defaultImage;
  }
  return cocktailImage;
}

function renderCocktailList() {
  let html = '';

  for (const drinkItem of drinks) {
    let favoriteClass = '';
    let favoriteClassName = '';
    let imageSrc = generateDefaultImage(drinkItem);

    const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
      return favCocktail.idDrink === drinkItem.idDrink;
    });

    if (foundFavoriteIndex !== -1) {
      favoriteClass = 'favCocktail';
      favoriteClassName = 'favCocktailName';
    } else {
      favoriteClass = '';
      favoriteClassName = '';
    }

    html += `<li class="${favoriteClass} js-cocktail" id="${drinkItem.idDrink}">`;
    html += `<img alt="Cóctel" class="cocktailImg" src="${imageSrc}" />`;
    html += `<h3 class="${favoriteClassName}">${drinkItem.strDrink}</h3>`;
    html += `</li>`;

    cocktailList.innerHTML = html;
  }
  cocktailListener();
}

function renderFavoriteCocktails() {
  let html = '';

  for (const drinkItem of favoriteCocktails) {
    // let favoriteClass = '';
    // let favoriteClassName = '';
    let imageSrc = generateDefaultImage(drinkItem);

    html += `<li>`;
    html += `<i class="js-unfav fa-solid fa-heart-circle-xmark" id="${drinkItem.idDrink}"></i>`;
    html += `<img alt="Cóctel" class="cocktailImg" src="${imageSrc}" />`;
    html += `<h3>${drinkItem.strDrink}</h3>`;
    html += `</li>`;
  }
  favoritesList.innerHTML = html;
  dislikedListener();
}

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

function dislikedListener() {
  const dislikes = document.querySelectorAll('.js-unfav');
  for (const btnDislike of dislikes) {
    btnDislike.addEventListener('click', handleClickDislike);
  }
}

function handleClickCocktail(event) {
  const selectedCocktailId = event.currentTarget.id;
  const foundCocktail = drinks.find((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  if (foundFavoriteIndex === -1) {
    favoriteCocktails.push(foundCocktail);
  } else {
    favoriteCocktails.splice(foundFavoriteIndex, 1);
  }

  localStorage.setItem('favoriteCocktails', JSON.stringify(favoriteCocktails));

  renderCocktailList();
  renderFavoriteCocktails();
}

function cocktailListener() {
  const cocktailListItem = document.querySelectorAll('.js-cocktail');
  for (const listItem of cocktailListItem) {
    listItem.addEventListener('click', handleClickCocktail);
  }
}

function handleClickReset(event) {
  event.preventDefault();
  inputSearch.value = '';
  // drinks = [];
  favoriteCocktails = [];
  cocktailList.innerHTML = '';
  favoritesList.innerHTML = '';
  localStorage.removeItem('favoriteCocktails');
}

function getFavLocalStorage() {
  const savedFavorites = localStorage.getItem('favoriteCocktails');
  if (savedFavorites !== null) {
    favoriteCocktails = JSON.parse(savedFavorites);
    renderFavoriteCocktails();
  }
}

// Llamada a la función
getFavLocalStorage();

// Listeners
btnSubmit.addEventListener('click', handleInputSearch);
btnReset.addEventListener('click', handleClickReset);
