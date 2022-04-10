'use strict';
// Constantes
const cocktailList = document.querySelector('.js-cocktailList');
const favoritesList = document.querySelector('.js-favoritesList');

const inputSearch = document.querySelector('.js-search');
const defaultImage =
  'https://via.placeholder.com/150x150/ffffff/666666/?text=drink';

const btnSubmit = document.querySelector('.js-submitBtn');
const btnReset = document.querySelector('.js-resetBtn');

const btnDislikeAll = document.querySelector('.js-dislikeAll');

// Variables (arrays)
let drinks = [];
let favoriteCocktails = [];

// Funciones

// Filtrar los resultados del input de búsqueda con una función manejadora del evento click del botón "buscar"
function handleInputSearch(event) {
  event.preventDefault();

  // Constante para el cóctel buscado
  const filterValue = inputSearch.value;

  // Fetch al servidor de los cócteles
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filterValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Guardar la información de los cócteles en su variable global
      drinks = data.drinks;
      if (inputSearch.value === '') {
        // alert('El campo de búsqueda no puede estar vacío');
        cocktailList.innerHTML = '...¡Nada por aquí!';
      } else {
        renderCocktailList();
      }
    });
}

// Función para generar una imagen por defecto, en caso de que no hubiera imagen original
function generateDefaultImage(drinkItem) {
  let cocktailImage = '';
  if (drinkItem.strDrinkThumb !== null) {
    cocktailImage = drinkItem.strDrinkThumb;
  } else {
    cocktailImage = defaultImage;
  }
  return cocktailImage;
}

// Pintar/renderizar la lista entera de cócteles
function renderCocktailList() {
  let html = '';

  for (const drinkItem of drinks) {
    // Variables que dan clases para resaltar el seleccionado como favorito
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

    html += `<li class="cocktailList__item ${favoriteClass} js-cocktail" id="${drinkItem.idDrink}">`;
    html += `<img alt="Cóctel" class="cocktailImg" src="${imageSrc}" />`;
    html += `<h3 class="favoritesList__name ${favoriteClassName}">${drinkItem.strDrink}</h3>`;
    html += `</li>`;

    cocktailList.innerHTML = html;
  }
  // Listener para cada cóctel
  cocktailListener();
}

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

function handleClickCocktail(event) {
  // Obtener a qué cóctel doy clic
  const selectedCocktailId = event.currentTarget.id;

  // ¿Existe el cóctel en el listado de favoritos?
  const foundCocktail = drinks.find((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  if (foundFavoriteIndex === -1) {
    // No encontrado
    favoriteCocktails.push(foundCocktail);
  } else {
    // Eliminar de la lista de favoritos
    favoriteCocktails.splice(foundFavoriteIndex, 1);
  }

  localStorage.setItem('favoriteCocktails', JSON.stringify(favoriteCocktails));

  renderCocktailList();
  renderFavoriteCocktails();
}

// Listener (evento clic) para cada cóctel
function cocktailListener() {
  const cocktailListItem = document.querySelectorAll('.js-cocktail');
  for (const listItem of cocktailListItem) {
    listItem.addEventListener('click', handleClickCocktail);
  }
}

// Función manejadora para el botón de reset
function handleClickReset(event) {
  event.preventDefault();
  inputSearch.value = '';
  // drinks = [];
  favoriteCocktails = [];
  cocktailList.innerHTML = '';
  favoritesList.innerHTML = '';
  localStorage.clear('favoriteCocktails');
}

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

// Listeners (evento clic) de los botones
btnSubmit.addEventListener('click', handleInputSearch);
btnReset.addEventListener('click', handleClickReset);
btnDislikeAll.addEventListener('click', handleDislikeAllFavs);
