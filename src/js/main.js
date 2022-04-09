'use strict';
// Constantes
const cocktailList = document.querySelector('.js-cocktailList');
const favoritesList = document.querySelector('.js-favoritesList');
const inputSearch = document.querySelector('.js-search');
const btnSubmit = document.querySelector('.js-submitBtn');
const btnReset = document.querySelector('.js-resetBtn');
const defaultImg =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=drink';

// Variables
let drinks = [];
let favoriteCocktails = [];

// Funciones
function validateInputValue() {
  if (inputSearch.value === '') {
    alert('Busca un cóctel para empezar');
    handleClickReset();
  }
}

function handleInputSearch(event) {
  event.preventDefault();
  validateInputValue();

  const filterValue = inputSearch.value;

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filterValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      drinks = data.drinks;
      renderCocktailList();
    });
}

function renderCocktailList() {
  let html = '';

  for (const drinkItem of drinks) {
    let favoriteClass = '';
    let favoriteClassName = '';

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

    if (drinkItem.strDrinkThumb !== null) {
      html += `<li class="${favoriteClass} js-cocktail" id="${drinkItem.idDrink}">`;
      // strImageSource tiene DEMASIADAS rutas null
      html += `<img alt="Cóctel" class="cocktailImg" src="${drinkItem.strDrinkThumb}" />`;
      html += `<h3 class="${favoriteClassName}">${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    } else {
      html += `<li class="${favoriteClass} js-cocktail" id="${drinkItem.idDrink}">`;
      html += `<img alt="Cóctel" class="cocktailImg" src="${defaultImg}" />`;
      html += `<h3 class="${favoriteClassName}">${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    }
    cocktailList.innerHTML = html;
  }
  cocktailListener();
}

function renderFavoriteCocktails() {
  let html = '';

  for (const drinkItem of favoriteCocktails) {
    if (drinkItem.strDrinkThumb !== null) {
      html += `<li class="js-cocktail" id="${drinkItem.idDrink}">`;
      html += `<img alt="Cóctel" class="cocktailImg" src="${drinkItem.strDrinkThumb}" />`;
      html += `<h3>${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    } else {
      html += `<li class="js-cocktail" id="${drinkItem.idDrink}">`;
      html += `<img alt="Cóctel" class="cocktailImg" src="${defaultImg}" />`;
      html += `<h3>${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    }
  }
  favoritesList.innerHTML = html;
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

function getFavLocalStorage() {
  const savedFavorites = localStorage.getItem('favoriteCocktails');
  if (savedFavorites !== null) {
    favoriteCocktails = JSON.parse(savedFavorites);
    renderFavoriteCocktails();
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

// Llamadas a la función
getFavLocalStorage();

// Listeners
btnSubmit.addEventListener('click', handleInputSearch);
btnReset.addEventListener('click', handleClickReset);
