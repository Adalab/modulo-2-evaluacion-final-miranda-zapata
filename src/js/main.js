'use strict';
// Datos HTML
const cocktailList = document.querySelector('.js-cocktailList');
const inputSearch = document.querySelector('.js-search');
const btnSubmit = document.querySelector('.js-submitBtn');
const btnReset = document.querySelector('.js-resetBtn');

// Constante para la imagen por defecto
const defaultImg =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=drink';

// Array/lista de todas las bebidas
let drinks = [];
// Array/lista de cócteles favoritos
let favoriteCocktails = [];

// Listener (evento clic) para cada cóctel
function cocktailListener() {
  const cocktailListItem = document.querySelectorAll('.js-cocktail');
  for (const listItem of cocktailListItem) {
    listItem.addEventListener('click', handleClickCocktail);
  }
}

// Pintar/renderizar la lista entera de cócteles
function renderCocktailList() {
  let html = '';

  for (const drinkItem of drinks) {
    // Variables que dan clases para resaltar el seleccionado como favorito
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
  // Listener para cada cóctel
  cocktailListener();
}

const favoritesList = document.querySelector('.js-favoritesList');

// Pintar/renderizar la lista de cócteles favoritos
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

// Función manejadora
function handleClickCocktail(event) {
  console.log(event.currentTarget.id);
  const selectedCocktailId = event.currentTarget.id; // Obtener a qué cóctel doy clic

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
  console.log(favoriteCocktails); // Ver en la consola que los cócteles se quitan y se ponen
  localStorage.setItem('favoriteCocktails', JSON.stringify(favoriteCocktails));
  renderCocktailList();
  renderFavoriteCocktails();
}

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

      // const filteredList =
      /* drinks.filter((drinkItem) => {
        return drinkItem.strDrink
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }); */
      // drinks = filteredList;
      renderCocktailList();

      console.log(filterValue);
    });
}

// Local storage
function getFavCocktailsLS() {
  const savedFavorites = localStorage.getItem('favoriteCocktails');
  if (savedFavorites !== null) {
    favoriteCocktails = JSON.parse(savedFavorites);
    renderFavoriteCocktails();
  }
}
getFavCocktailsLS();

// Función manejadora para el botón de reset
function handleClickReset(event) {
  event.preventDefault();

  // drinks = [];
  favoriteCocktails = [];

  cocktailList.innerHTML = '';
  favoritesList.innerHTML = '';

  localStorage.removeItem('favoriteCocktails');
}

// Listener (evento clic) del botón de búsqueda
btnSubmit.addEventListener('click', handleInputSearch);
btnReset.addEventListener('click', handleClickReset);
